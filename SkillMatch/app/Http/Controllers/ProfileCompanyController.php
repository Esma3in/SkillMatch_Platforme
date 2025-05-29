<?php

namespace App\Http\Controllers;

use App\Models\Ceo;
use App\Models\Company;
use App\Models\CompanyDocument;
use App\Models\Service;
use App\Models\LegalDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Ensure this is imported
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileCompanyController extends Controller
{
    public function store(Request $request)
    {
        // --- START DEBUGGING BLOCK FOR LARAVEL ---
        Log::info('--- Incoming Request Start ---');
        Log::info('Full Request Data (all fields):', $request->all());
        Log::info('Files Array (request->files):', $request->files->all()); // This should now show your files!

        // Try to decode jsonData immediately and log, handle errors
        $jsonData = [];
        if ($request->has('jsonData')) {
            try {
                $jsonData = json_decode($request->input('jsonData'), true);
                Log::info('Decoded jsonData (from request input):', $jsonData);
            } catch (\Exception $e) {
                Log::error('JSON Decoding Error in ProfileCompanyController:', ['message' => $e->getMessage(), 'jsonData_raw' => $request->input('jsonData')]);
                // Return an early error if JSON is malformed
                return response()->json(['errors' => ['jsonData' => ['Invalid JSON data provided.']]], 400);
            }
        } else {
            Log::warning('jsonData field is missing from the request in ProfileCompanyController. This might cause validation issues if it\'s required.');
        }
        Log::info('--- Incoming Request End ---');
        // --- END DEBUGGING BLOCK FOR LARAVEL ---


        // --- Step 1: Validate top-level FormData and the presence of valid JSON ---
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',

            // Change 'sometimes' to 'required' if these files are mandatory for creation
            'companyData.logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Changed from 'sometimes'
            'companyData.file' => 'required|mimes:pdf,doc,docx,txt,xls,xlsx,ppt,pptx|max:10240', // Changed from 'sometimes', added excel/ppt types
            'ceoData.avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',   // Changed from 'sometimes'

            'jsonData' => 'required|json', // Ensure jsonData is a valid JSON string
        ]);

        if ($validator->fails()) {
            Log::error("Basic FormData validation failed in ProfileCompanyController", ['errors' => $validator->errors()->toArray(), 'request_data' => $request->all()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // --- Step 2: Validate the *content* and structure of the JSON data ---
        // $jsonData is already decoded from the logging block above.
        $jsonValidator = Validator::make($jsonData, [ // Use the $jsonData variable here
            'companyData.sector' => 'required|string|max:255',
            'companyProfileData.websiteUrl' => 'required|string|max:255',
            'companyProfileData.address' => 'required|string|max:255|min:5',
            'companyProfileData.phone' => 'required|string|max:50|min:7',
            'companyProfileData.Bio' => 'required|string|min:50',
            'companyProfileData.Datecreation' => 'required|date',
            'ceoData.name' => 'required|string|max:255|min:3',
            'ceoData.description' => 'required|string|min:50',

            // Services validation
            'services' => 'required|array|min:1',
            'services.*.title' => 'required|string|max:255|min:3',
            'services.*.descriptions' => 'required|array|min:1',
            'services.*.descriptions.*' => 'required|string|min:3',

            // Legal Documents validation
            'legalDocuments' => 'required|array|min:1',
            'legalDocuments.*.title' => 'required|string|max:255|min:3',
            'legalDocuments.*.descriptions' => 'required|array|min:1',
            'legalDocuments.*.descriptions.*' => 'required|string|min:3',
        ]);

        if ($jsonValidator->fails()) {
             Log::error("JSON content validation failed in ProfileCompanyController", ['errors' => $jsonValidator->errors()->toArray(), 'json_data' => $jsonData]);
             // Merge validation errors from both validators
             $errors = array_merge($validator->errors()->toArray(), $jsonValidator->errors()->toArray());
             return response()->json(['errors' => $errors], 422);
        }

        // IMPORTANT: The validation has already done the data extraction for the files.
        // The `$request->file()` methods will directly get the uploaded File objects.
        // We don't need to look for them within the `jsonData` array.
        $validatedData = array_merge($validator->validated(), ['jsonData' => $jsonData]);

        $company = Company::find($validatedData['company_id']);

        DB::beginTransaction();

        try {
            $updateDataCompany = [
                'sector' => $validatedData['jsonData']['companyData']['sector'],
            ];

            // Handle company logo upload and old file cleanup
            if ($request->hasFile('companyData.logo')) {
                $file = $request->file('companyData.logo');
                Log::info('Storing company logo:', ['name' => $file->getClientOriginalName()]);
                if ($company->logo) {
                    Storage::disk('public')->delete($company->logo);
                }
                $updateDataCompany['logo'] = $file->store('images/companies', 'public');
            } else {
                 Log::info('No new companyData.logo provided or detected by hasFile().');
            }

            // Handle main company file upload and old file cleanup
            if ($request->hasFile('companyData.file')) {
                $file = $request->file('companyData.file');
                Log::info('Storing company document:', ['name' => $file->getClientOriginalName()]);
                if ($company->file) { // Assuming 'file' column on Company model for a primary document
                    Storage::disk('public')->delete($company->file);
                }
                $filepath = $file->store('company_documents', 'public');
                $updateDataCompany['file'] = $filepath;

                // Create a CompanyDocument record for this file (if applicable)
                // Note: If 'file' column on Company is for a single primary document,
                // and CompanyDocument is for supplementary documents, this is fine.
                // If it's the same document, consider if you need two storage locations/records.
                CompanyDocument::create([
                    'company_id' => $company->id,
                    'document_type' => $file->getMimeType(),
                    'file_path' => $filepath,
                    'is_validated' => 0,
                    'status' => 'pending',
                    'validated_at' => null,
                ]);
            } else {
                Log::info('No new companyData.file provided or detected by hasFile().');
            }

            $company->update($updateDataCompany);

            $company->profile()->updateOrCreate(
                ['company_id' => $company->id],
                [
                    'websiteUrl' => $validatedData['jsonData']['companyProfileData']['websiteUrl'],
                    'address' => $validatedData['jsonData']['companyProfileData']['address'],
                    'phone' => $validatedData['jsonData']['companyProfileData']['phone'],
                    'Bio' => $validatedData['jsonData']['companyProfileData']['Bio'],
                    'DateCreation' => $validatedData['jsonData']['companyProfileData']['Datecreation'],
                ]
            );

            $ceoUpdateOrCreateData = [
                'name' => $validatedData['jsonData']['ceoData']['name'],
                'description' => $validatedData['jsonData']['ceoData']['description'],
            ];

            if ($request->hasFile('ceoData.avatar')) {
                $file = $request->file('ceoData.avatar');
                Log::info('Storing CEO avatar:', ['name' => $file->getClientOriginalName()]);
                $ceo = $company->ceo;
                if ($ceo && $ceo->avatar) {
                     Storage::disk('public')->delete($ceo->avatar);
                }
                $ceoUpdateOrCreateData['avatar'] = $file->store('images/ceos', 'public');
            } else {
                Log::info('No new ceoData.avatar provided or detected by hasFile().');
            }

            Ceo::updateOrCreate(
                ['company_id' => $company->id],
                $ceoUpdateOrCreateData
            );

            // Re-sync services
            $company->services()->delete(); // Clear existing
            foreach ($validatedData['jsonData']['services'] as $serviceData) {
                $company->services()->create([
                    'title' => $serviceData['title'],
                    'descriptions' => $serviceData['descriptions'], // Assuming this is stored as JSON or string directly
                ]);
            }

            // Re-sync legal documents
            $company->legaldocuments()->delete(); // Clear existing
            foreach ($validatedData['jsonData']['legalDocuments'] as $docData) {
                 $company->legaldocuments()->create([
                    'title' => $docData['title'],
                    'descriptions' => $docData['descriptions'], // Assuming this is stored as JSON or string directly
                 ]);
            }

            DB::commit();

            return response()->json('Data updated successfully', 200);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error("Error processing company profile update in ProfileCompanyController: " . $e->getMessage(), [
                'company_id' => $company->id ?? 'N/A',
                'error_trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
                'json_data' => $jsonData ?? 'N/A',
            ]);

            return response()->json(['message' => 'Error processing data update.'], 500);
        }
    }
}