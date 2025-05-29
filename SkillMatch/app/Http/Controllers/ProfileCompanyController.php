<?php

namespace App\Http\Controllers;

use App\Models\Ceo;
use App\Models\Company;
use App\Models\CompanyDocument;
use App\Models\Service;
use App\Models\LegalDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileCompanyController extends Controller
{
    public function store(Request $request)
    {
        Log::info('--- Incoming Request Start ---');
        Log::info('Full Request Data (all fields):', $request->all());
        Log::info('Files Array (request->files):', $request->files->all());

        $jsonData = [];
        if ($request->has('jsonData')) {
            try {
                $jsonData = json_decode($request->input('jsonData'), true);
                Log::info('Decoded jsonData (from request input):', $jsonData);
            } catch (\Exception $e) {
                Log::error('JSON Decoding Error in ProfileCompanyController:', ['message' => $e->getMessage(), 'jsonData_raw' => $request->input('jsonData')]);
                return response()->json(['errors' => ['jsonData' => ['Invalid JSON data provided.']]], 400);
            }
        } else {
            Log::warning('jsonData field is missing from the request in ProfileCompanyController. This might cause validation issues if it\'s required.');
        }
        Log::info('--- Incoming Request End ---');


        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',
            'companyData.logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'companyData.file' => 'required|mimes:pdf,doc,docx,txt,xls,xlsx,ppt,pptx|max:10240',
            'ceoData.avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'jsonData' => 'required|json',
        ]);

        if ($validator->fails()) {
            Log::error("Basic FormData validation failed in ProfileCompanyController", ['errors' => $validator->errors()->toArray(), 'request_data' => $request->all()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $jsonValidator = Validator::make($jsonData, [
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
            'services.*.descriptions.*' => 'string|min:3', // <-- ENSURE 'required' IS REMOVED HERE

            // Legal Documents validation
            'legalDocuments' => 'required|array|min:1',
            'legalDocuments.*.title' => 'required|string|max:255|min:3',
            'legalDocuments.*.descriptions' => 'required|array|min:1',
            'legalDocuments.*.descriptions.*' => 'string|min:3', // <-- ENSURE 'required' IS REMOVED HERE
        ]);

        if ($jsonValidator->fails()) {
             Log::error("JSON content validation failed in ProfileCompanyController", ['errors' => $jsonValidator->errors()->toArray(), 'json_data' => $jsonData]);
             $errors = array_merge($validator->errors()->toArray(), $jsonValidator->errors()->toArray());
             return response()->json(['errors' => $errors], 422);
        }

        $validatedData = array_merge($validator->validated(), ['jsonData' => $jsonData]);

        $company = Company::find($validatedData['company_id']);

        DB::beginTransaction();

        try {
            $updateDataCompany = [
                'sector' => $validatedData['jsonData']['companyData']['sector'],
            ];

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

            if ($request->hasFile('companyData.file')) {
                $file = $request->file('companyData.file');
                Log::info('Storing company document:', ['name' => $file->getClientOriginalName()]);
                if ($company->file) {
                    Storage::disk('public')->delete($company->file);
                }
                $filepath = $file->store('company_documents', 'public');
                $updateDataCompany['file'] = $filepath;

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

            $company->services()->delete();
            foreach ($validatedData['jsonData']['services'] as $serviceData) {
                $company->services()->create([
                    'title' => $serviceData['title'],
                    'descriptions' => $serviceData['descriptions'],
                ]);
            }

            $company->legaldocuments()->delete();
            foreach ($validatedData['jsonData']['legalDocuments'] as $docData) {
                 $company->legaldocuments()->create([
                    'title' => $docData['title'],
                    'descriptions' => $docData['descriptions'],
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