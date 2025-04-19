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
}
