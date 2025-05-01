<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use Illuminate\Http\Request;
use App\Models\CompaniesSelected;

class CompaniesSelectedController extends Controller
{
    public function selectCompany(Request $request)
    {
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'company_id' => 'required|exists:companies,id'
        ]);
    
        $exists = CompaniesSelected::where('candidate_id', $validated['candidate_id'])
                    ->where('company_id', $validated['company_id'])
                    ->exists();
    
        if ($exists) {
            return response()->json(['message' => 'Company is already selected']);
        }
    
        CompaniesSelected::create($validated);
    
        return response()->json(['message' => 'Company selected successfully!']);
    }
    

    public function getCompanies($id)
    {
        $candidate = Candidate::find($id);
    
        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }
    
        $companies = $candidate->companies_selcted;
        return response()->json($companies, 200);
    }
}
