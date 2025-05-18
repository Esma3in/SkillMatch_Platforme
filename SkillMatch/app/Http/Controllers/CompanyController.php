<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Skill;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::with(['skills', 'profile'])->paginate(10);
        return response()->json($companies, 200);
    }

    public function GetCompany($id)
    {
        $company = Company::with(['profile', 'skills', 'tests', 'ceo'])->find($id);
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
        $company = Company::with(['profile', 'skills', 'ceo', 'services', 'legaldocuments','user'])->find($company_id);

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

    //create test
    public function storeTests(Request $request)
    {
        $validatedData = $request->validate([
            'objective' => 'required|string',
            'prerequisites' => 'nullable|string',
            'tools_Required' => 'required|string',
            'before_answer' => 'required|string',
            'qcm_id' => 'required|exists:qcms,id',
            'company_id' => 'required|exists:companies,id',
            'skill_id' => 'required|exists:skills,id',
            'skill_ids' => 'nullable|array',
            'skill_ids.*' => 'exists:skills,id',
            'steps' => 'nullable|array',
            'steps.*.title' => 'required|string',
            'steps.*.description' => 'nullable|string',
            'steps.*.order' => 'required|integer',
        ]);

        $test = Test::create([
            'objective' => $validatedData['objective'],
            'prerequisites' => $validatedData['prerequisites'] ?? null,
            'tools_Required' => $validatedData['tools_Required'],
            'before_answer' => $validatedData['before_answer'],
            'qcm_id' => $validatedData['qcm_id'],
            'company_id' => $validatedData['company_id'],
            'skill_id' => $validatedData['skill_id'], // belongsTo
        ]);

        // Ajouter des compétences
        if (!empty($validatedData['skill_ids'])) {
            $test->skills()->attach($validatedData['skill_ids']);
        }

        // Ajouter des étapes
        if (!empty($validatedData['steps'])) {
            foreach ($validatedData['steps'] as $stepData) {
                $test->steps()->create([
                    'title' => $stepData['title'],
                    'description' => $stepData['description'] ?? null,
                    'order' => $stepData['order'],
                ]);
            }
        }

        return response()->json([
            'message' => 'Test créé avec succès.',
            'test' => $test->load('skills', 'steps', 'company', 'qcm'),
        ], 201);
    }

}
