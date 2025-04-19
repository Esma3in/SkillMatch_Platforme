<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Profiler\Profile;

class CandidateController extends Controller
{

    public function CompaniesMatched($id) {
        $candidate = Candidate::with(['skills'])->findOrFail($id);
        Log::info($candidate);
        $candidateSkillIds = $candidate->skills->pluck('id')->toArray();
        Log::info($candidateSkillIds);
        $companies = Company::with(['skills', 'profile'])->get();
        Log::info($companies);
        $companiesSuggested = [];
    
        foreach ($companies as $company) {
            $companySkillIds = $company->skills->pluck('id')->toArray();
            Log::info($companySkillIds);
            if (count(array_intersect($candidateSkillIds, $companySkillIds)) > 0) {
                $companiesSuggested[] = $company;
            }
        }
    
        return response()->json($companiesSuggested, 200);
    }
    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:candidates,email',
            'password' => 'required|min:6',
        ]);
    
        // You might want to hash the password:
        $validated['password'] = bcrypt($validated['password']);
        

        $candidate = Candidate::create($validated);
    
            session()->put('candidate_id',$candidate->id);
            return response()->json($candidate->id, 201);

    }
}
