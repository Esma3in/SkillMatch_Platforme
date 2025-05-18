<?php

namespace App\Http\Controllers;

use App\Models\Ceo;
use App\Models\Company;
use App\Models\Service; // Import Service model
use App\Models\LegalDocument; // Import LegalDocument model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Models\Profile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator; // Import Validator facade

class ProfileCompanyController extends Controller
{
    // --- Store/Update Method ---
    public function store(Request $request)
    {
        // Log the request *before* validation for debugging if needed, but don't return
        // Log::info($request);
        // return ;

        // --- Step 1: Validate top-level FormData and the presence of valid JSON ---
        // Use Validator facade for more control over validation errors and merging
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',

            // File uploads validated directly from the request
            'companyData.logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'companyData.file' => 'required|mimes:pdf,doc,docx,txt|max:10240',
            'ceoData.avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',

            // Validate the JSON string content
            'jsonData' => 'required|json',
        ]);

        // If basic validation fails (including 'jsonData' being valid JSON)
        if ($validator->fails()) {
            Log::error("Basic validation failed", ['errors' => $validator->errors()->toArray()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Decode the JSON string *after* primary validation confirms it's valid JSON
        // Use input() to get data from FormData, ensuring it's treated as a string
        $jsonData = json_decode($request->input('jsonData'), true);

        // --- Step 2: Validate the *content* and structure of the JSON data ---
        $jsonValidator = Validator::make($jsonData, [
            // Company & CEO data from JSON
            'companyData.sector' => 'required|string|max:255',
            'companyProfileData.websiteUrl' => 'required|max:255', // Changed from 'max:255' to 'url|max:255' to match frontend
            'companyProfileData.address' => 'required|string|max:255|min:5',
            'companyProfileData.phone' => 'required|string|max:50|min:7',
            'companyProfileData.Bio' => 'required|string|min:50',
            'companyProfileData.Datecreation' => 'required|date',
            'ceoData.name' => 'required|string|max:255|min:3',
            'ceoData.description' => 'required|string|min:50',

            // Services validation (using the new structure with 'title' and 'description' array)
            'services' => 'required|array|min:1', // Require at least one service (the array itself)
            'services.*.title' => 'required|string|max:255|min:3', // Validate each service item's 'title' field
            'services.*.descriptions' => 'required|array|min:1', // Validate each service item's 'description' field is an array with min 1 item

            // Legal Documents validation (using the new structure with 'title' and 'description' array)
            'legalDocuments' => 'required|array|min:1', // Require at least one legal doc (the array itself)
            'legalDocuments.*.title' => 'required|string|max:255|min:3', // Validate each legal doc item's 'title' field
            'legalDocuments.*.descriptions' => 'required|array|min:1', // Validate each legal doc item's 'description' field is an array with min 1 item
        ]);

         // If JSON content validation fails
        if ($jsonValidator->fails()) {
             Log::error("JSON content validation failed", ['errors' => $jsonValidator->errors()->toArray()]);
             // Merge errors from both validators for a complete response
             $errors = array_merge($validator->errors()->toArray(), $jsonValidator->errors()->toArray());
             return response()->json(['errors' => $errors], 422);
        }

         // --- Data is now fully validated and parsed ---
         // Combine validated data from initial request and parsed JSON for easier access
         $validatedData = array_merge($validator->validated(), ['jsonData' => $jsonData]);


        // Find the company (guaranteed to exist by validation)
        $company = Company::find($validatedData['company_id']);

        // --- Start Database Transaction ---
        DB::beginTransaction();

        try {
            // --- Update Company, Profile, CEO (as before, using data from $validatedData['jsonData']) ---

            $updateDataCompany = [
                'sector' => $validatedData['jsonData']['companyData']['sector'],
            ];

            // Handle file uploads and old file cleanup for Company
            if ($request->hasFile('companyData.logo')) {
                // Delete old logo if it exists
                if ($company->logo) {
                    Storage::disk('public')->delete($company->logo);
                }
                $updateDataCompany['logo'] = $request->file('companyData.logo')->store('images/companies', 'public'); // Use request->file() and store
            }

            if ($request->hasFile('companyData.file')) {
                 // Delete old file if it exists
                if ($company->file) {
                    Storage::disk('public')->delete($company->file);
                }
                $updateDataCompany['file'] = $request->file('companyData.file')->store('files/companies', 'public'); // Use request->file() and store
            }

            // Update the company
            $company->update($updateDataCompany);

            // Handle Profile - Use updateOrCreate, get data from $validatedData['jsonData']
            $company->profile()->updateOrCreate(
                ['company_id' => $company->id], // Condition to find the related profile
                [ // Data to update/create
                    'websiteUrl' => $validatedData['jsonData']['companyProfileData']['websiteUrl'],
                    'address' => $validatedData['jsonData']['companyProfileData']['address'],
                    'phone' => $validatedData['jsonData']['companyProfileData']['phone'],
                    'Bio' => $validatedData['jsonData']['companyProfileData']['Bio'],
                    'DataCreation' => $validatedData['jsonData']['companyProfileData']['Datecreation'], // Ensure field name matches DB
                ]
            );

            // Handle CEO - Use updateOrCreate, get data from $validatedData['jsonData']
            $ceoUpdateOrCreateData = [
                'name' => $validatedData['jsonData']['ceoData']['name'],
                'description' => $validatedData['jsonData']['ceoData']['description'],
            ];

            // Handle file uploads and old file cleanup for CEO
            if ($request->hasFile('ceoData.avatar')) {
                // Find the existing CEO first if it exists, to get the old avatar path
                // Or eager load CEO with the company
                 $ceo = $company->ceo; // Assumes CEO exists or relationship is nullable
                if ($ceo && $ceo->avatar) {
                     Storage::disk('public')->delete($ceo->avatar);
                }
                $ceoUpdateOrCreateData['avatar'] = $request->file('ceoData.avatar')->store('images/ceos', 'public'); // Store
            }

             // Assuming a one-to-one relationship where the CEO record has a company_id
             Ceo::updateOrCreate(
                ['company_id' => $company->id], // Condition
                $ceoUpdateOrCreateData // Data
            );


            // --- Step 3: Process Services ---
            // Strategy: Delete all existing services for this company, then re-create them from the payload.
            // Ensure your Service model has $fillable = ['company_id', 'title', 'description']; and $casts = ['description' => 'array'];
            $company->services()->delete(); // Delete existing services

            foreach ($validatedData['jsonData']['services'] as $serviceData) {
                // Create the Service record linked to the company
                // Laravel automatically casts the 'description' array to JSON because of the model cast
                Log::info($serviceData);
                $company->services()->create([
                    'title' => $serviceData['title'],
                    'descriptions' => $serviceData['descriptions'], // Save the array directly
                ]);
                 // No need to loop through descriptions separately anymore as they are part of the JSON column
            }

            // --- Step 4: Process Legal Documents ---
            // Strategy: Delete all existing legal documents for this company, then re-create them from the payload.
            // Ensure your LegalDocument model has $fillable = ['company_id', 'title', 'description']; and $casts = ['description' => 'array'];
            $company->legaldocuments()->delete(); // Delete existing legal documents

            foreach ($validatedData['jsonData']['legalDocuments'] as $docData) {
                 // Create the LegalDocument record linked to the company
                 // Laravel automatically casts the 'description' array to JSON because of the model cast
                 $company->legaldocuments()->create([
                    'title' => $docData['title'],
                    'descriptions' => $docData['descriptions'], // Save the array directly
                 ]);
                 // No need to loop through descriptions separately anymore
            }


            // --- Step 5: Commit Transaction ---
            DB::commit();

            return response()->json('Data updated successfully', 200);

        } catch (\Exception $e) {
            // --- Step 6: Rollback Transaction and Handle Error ---
            DB::rollBack();

            // Log the detailed error
            Log::error("Error processing company profile update: " . $e->getMessage(), [
                'company_id' => $company->id ?? 'N/A', // Handle case where $company might not be set
                'error_trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
                'json_data' => $jsonData ?? 'N/A', // Handle case where jsonData might not be set/decoded
            ]);

            // Return a generic error response (avoid exposing detailed error in production)
            return response()->json(['message' => 'Error processing data update.'], 500);
        }
    }
}