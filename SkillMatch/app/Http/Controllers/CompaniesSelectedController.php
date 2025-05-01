<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Models\CompaniesSelected;
use Illuminate\Support\Facades\Auth;

class CompaniesSelectedController extends Controller
{
    public function selectCompany($candidate_id, Request $request)
    {
        $user = $request->user();

        // Vérification si le candidat existe
        $candidate = Candidate::find($candidate_id);
        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        // // Vérification que l'utilisateur authentifié est bien le candidat
        // if ($user->id !== $candidate->user_id) {
        //     return response()->json(['error' => 'Unauthorized. You can only select companies for your own profile.'], 403);
        // }

        // Validation des données envoyées
        $validated = $request->validate([
            'company_id' => 'required|integer|exists:companies,id',
            'name' => 'required|string',
            'skills' => 'nullable|string',
        ]);

        try {
            // Création de l'entrée dans CompaniesSelected
            $selection = CompaniesSelected::create([
                'candidate_id' => $candidate->id,
                'company_id' => $validated['company_id'],
                'name' => $validated['name'],
                
                'selected_at' => now(),
                //
            ]);

            return response()->json([
                'message' => 'Company selected successfully',
                'data' => $selection
            ], 201);


        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to select company: ' . $e->getMessage()], 500);
        }
    }

    public function getCompanySkills($company_id)
    {
        $company = Company::with('skills')->find($company_id);

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        return response()->json([
            'company_id' => $company->id,
            'name' => $company->name,
        ]);
    }

    public function getSelectedCompanies($candidate_id, Request $request)
    {
        $user = $request->user();

        $candidate = Candidate::find($candidate_id);
        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        if ($user->id !== $candidate->user_id) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        try {
            $selectedCompanies = CompaniesSelected::where('candidate_id', $candidate->id)
                ->with('company') // Eager load the company relationship
                ->get();

            return response()->json($selectedCompanies);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch selected companies: ' . $e->getMessage()], 500);
        }
    }
}
