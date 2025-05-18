<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\Company;
use Illuminate\Http\Request;
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
        // Validation des données
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'level' => 'required|string|in:Junior,Intermediate,Advanced',
            'type' => 'required|string|max:255',
            'usageFrequency' => 'required|string|in:Daily,Weekly,Rarely',
            'classement' => 'required|string|in:Important,Optional',
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

        return response()->json([
            'status' => 'success',
            'message' => 'Compétence créée avec succès',
            'skill' => $skill,
        ], 201);
    }
}
