<?php

namespace App\Http\Controllers;

use auth;
use Exception;
use App\Models\Test;
use App\Models\Skill;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\CompanyLegalDocuments;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = DB::table('companies as c')
            ->join('profile_companies as pc', 'pc.company_id', '=', 'c.id')
            ->leftJoin('companies_skills as cs', 'cs.company_id', '=', 'c.id')
            ->leftJoin('skills as s', 'cs.skill_id', '=', 's.id')
            ->select(
                'c.id as company_id',
                'c.name as company_name',
                'c.sector',
                'c.file',
                'c.logo',
                'c.state',
                'c.docstate',
                'pc.websiteUrl',
                'pc.address',
                'pc.phone',
                'pc.DateCreation',
                'pc.Bio',
                DB::raw('GROUP_CONCAT(s.name) as skills')
            )
            ->groupBy(
                'c.id',
                'c.name',
                'c.sector',
                'c.file',
                'c.logo',
                'c.state',
                'c.docstate',
                'pc.websiteUrl',
                'pc.address',
                'pc.phone',
                'pc.DateCreation',
                'pc.Bio'
            )
            ->paginate(10);

        return response()->json($companies, 200);
    }

    public function GetCompany($id)
    {
        $company = Company::with([])->find($id);
        if ($company) {
            return response()->json($company, 200);
        } else {
            return response()->json(['message' => 'company Not found'], 404);
        }
    }

    public function AllCompanies()
    {
        $companies = Company::whereIn('state', ['active', 'unactive', 'waiting'])
            ->get();
        return response()->json($companies, 200);
    }



    public function setstate(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'state' => 'required|in:unactive,active,banned'
        ]);
        $company = Company::where('id', $request->id)->first();
        if (!$company) {
            return response()->json(['error' => 'company not found'], 404);
        }
        $company->update([
            'state' => $request->state
        ]);
        return response()->json(['message' => 'company state updated successfully'], 200);
    }

    public function show($id)
    {
        // Find the company by ID
        $company = Company::find($id);

        // Check if the company exists
        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        // Return the state of the company
        return response()->json(['state' => $company->state], 200);
    }


    public function getProfile($company_id)
    {
        $company = Company::with(['profile', 'skills', 'ceo', 'services', 'legaldocuments', 'tests','user'])->find($company_id);

        if (!$company) {
            return response()->json(['message' => 'Company not found !!'], 404);
        }

        return response()->json($company);
    }


    //create skills
    /**
     * Create a new skill
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeSkills(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'level' => 'required|string|in:Junior,Intermediate,Advanced',
            'type' => 'required|string|max:255',
            'usageFrequency' => 'required|string|in:Daily,Weekly,Rarely',
            'classement' => 'required|string|in:Important,Optional',
            'company_id' => 'required|exists:companies,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Création de la compétence
        $skill = Skill::create([
            'name' => $request->name,
            'level' => $request->level,
            'type' => $request->type,
            'usageFrequency' => $request->usageFrequency,
            'classement' => $request->classement,
        ]);

        // Création de la relation dans la table pivot companies_skills
        DB::table('companies_skills')->insert([
            'company_id' => $request->company_id,
            'skill_id' => $skill->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Compétence créée avec succès et associée à l\'entreprise',
            'skill' => $skill,
        ], 201);
    }

    /**
     * Create a new programming test for company
     */
    public function storeTests(Request $request)
    {
        $validatedData = $request->validate([
            'objective' => 'required|string|max:255',
            'prerequisites' => 'nullable|string',
            'tools_Required' => 'required|string',
            'before_answer' => 'required|string',
            'qcm_id' => 'required|exists:qcms,id',
            'company_id' => 'required|exists:companies,id',
            'skill_id' => 'required|exists:skills,id',
            'skill_ids' => 'nullable|array',
            'skill_ids.*' => 'exists:skills,id',
            'steps' => 'required|array|min:1',
            'steps.*.title' => 'required|string|max:255',
            'steps.*.description' => 'nullable|string',
            'steps.*.order' => 'required|integer|min:1',
        ]);

        // Create the test
        $test = Test::create([
            'objective' => $validatedData['objective'],
            'prerequisites' => $validatedData['prerequisites'] ?? null,
            'tools_Required' => $validatedData['tools_Required'],
            'before_answer' => $validatedData['before_answer'],
            'qcm_id' => $validatedData['qcm_id'],
            'company_id' => $validatedData['company_id'],
            'skill_id' => $validatedData['skill_id'], // Primary skill (belongsTo)
        ]);

        // Attach additional skills (many-to-many relationship)
        if (!empty($validatedData['skill_ids'])) {
            // Filter out the primary skill to avoid duplication
            $additionalSkills = array_filter($validatedData['skill_ids'], function($skillId) use ($validatedData) {
                return $skillId != $validatedData['skill_id'];
            });

            if (!empty($additionalSkills)) {
                $test->skills()->attach($additionalSkills);
            }
        }

        // Create test steps
        if (!empty($validatedData['steps'])) {
            foreach ($validatedData['steps'] as $stepData) {
                $test->steps()->create([
                    'title' => $stepData['title'],
                    'description' => $stepData['description'] ?? null,
                    'order' => $stepData['order'],
                ]);
            }
        }

        // Load relationships for response
        $test->load(['skills', 'steps', 'company', 'qcm', 'skill']);

        return response()->json([
            'message' => 'Test créé avec succès.',
            'test' => $test,
        ], 201);
    }
    public function all(){
        $companiesAll = Company::all();
        return response()->json($companiesAll);
    }

    /**
     * Get detailed company information for admin view
     */
    public function getDetailedCompany($id)
    {
        // Find the company
        $company = Company::where('id', $id)
            ->with([
                'user',
                'skills',
                'profile'
            ])
            ->first();

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        // Format skills
        $skills = $company->skills->map(function ($skill) {
            return $skill->name;
        });

        // Get profile information
        $profile = $company->profile ? [
            'description' => $company->profile->description,
            'address' => $company->profile->address,
            'phone' => $company->profile->phone,
            'website' => $company->profile->website
        ] : null;

        // Combine all data
        $data = [
            'id' => $company->id,
            'name' => $company->name,
            'email' => $company->user ? $company->user->email : null,
            'sector' => $company->sector,
            'logo' => $company->logo,
            'file' => $company->file,
            'state' => $company->state,
            'skills' => $skills,
            'description' => $profile ? $profile['description'] : null,
            'address' => $profile ? $profile['address'] : null,
            'phone' => $profile ? $profile['phone'] : null,
            'website' => $profile ? $profile['website'] : null,
            'created_at' => $company->created_at,
            'updated_at' => $company->updated_at
        ];

        return response()->json($data);
    }
    public function getBio($id){
        $company=Company::with('profile')->find($id);
        if(!$company){
            return response()->json('company not found ',404);
        }

        $bio = $company->profile->Bio;
        return response()->json($bio);
    }

    public function updatebio(Request $request){
    // Validate the request
    $request->validate([
        'company_id' => 'required|integer|exists:companies,id',
        'bio' => 'required|string|max:1000', // Adjust max length as needed
    ]);

    try {
        // Find the company
        $company = Company::with('profile')->find($request->company_id);

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        // Check if profile exists, create if it doesn't
        if (!$company->profile) {
            $company->profile()->create(['Bio' => $request->bio]);
        } else {
            // Update existing profile bio
            $company->profile->update(['Bio' => $request->bio]);
        }

        return response()->json([
            'message' => 'Bio updated successfully',
            'bio' => $request->bio
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred while updating the bio',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function updateProfile(Request $request)
{
    $request->validate([
        'company_id' => 'required|integer|exists:companies,id',
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'ceo' => 'nullable|string|max:255',
        'address' => 'nullable|string|max:500',
        'creation_date' => 'nullable|date',
    ]);

    try {
        $company = Company::findOrFail($request->company_id);

        // Update company basic info
        $company->update([
            'name' => $request->name,
        ]);

        // Update user email if company has associated user
        if ($company->user) {
            $company->user->update([
                'email' => $request->email,
            ]);
        }

        // Update or create CEO if provided
        if ($request->filled('ceo')) {
            // Assuming you have a CEO model/relationship
            if ($company->ceo) {
                $company->ceo->update(['name' => $request->ceo]);
            } else {
                // Create new CEO record if it doesn't exist
                $company->ceo()->create(['name' => $request->ceo]);
            }
        }

        // Update or create company profile
        $profileData = [];
        if ($request->filled('address')) {
            $profileData['address'] = $request->address;
        }
        if ($request->filled('creation_date')) {
            $profileData['DateCreation'] = $request->creation_date;
        }

        if (!empty($profileData)) {
            if ($company->profile) {
                $company->profile->update($profileData);
            } else {
                $company->profile()->create($profileData);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Company profile updated successfully',
            'data' => [
                'company' => $company->load(['user', 'ceo', 'profile'])
            ]
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to update company profile',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function storeLegaldocument(Request $request)
{
    try {
        // Validate the incoming request
        $validatedData = $request->validate([
            'company_id'=>'required',
            'title' => 'required|string|max:255',
            'descriptions' => 'required|array'
        ]);

        // Handle file upload if present


        // Create the legal document
        $legalDocument = CompanyLegalDocuments::create([
            'company_id'=>$validatedData['company_id'],
            'title' => $validatedData['title'],
            'descriptions' => $validatedData['descriptions'],
        ]);

        // Log the activity

        return response()->json([
            'success' => true,
            'message' => 'Legal document created successfully',

        ], 201);

    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);

    } catch (Exception $e) {
        // Log the error
        Log::error('Legal document creation failed: ' . $e->getMessage(), [
            'request_data' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'An error occurred while creating the legal document',
            'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
        ], 500);
    }
}
}
