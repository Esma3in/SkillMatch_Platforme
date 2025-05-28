<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanyDashboardController extends Controller
{
    public function getCompanyTestCount(Request $request)
    {
        $companyId = $request->company_id;

        $testCount = Company::withCount('tests')
            ->where('id', $companyId)
            ->first();

        return response()->json($testCount);
    }

    public function getSelectedCandidatesByCompany(Request $request)
    {
        $companyId = $request->company_id;

        $company = Company::withCount('selectedCandidates')
            ->with(['selectedCandidates.candidate.profile'])
            ->where('id', $companyId)
            ->first();

        return response()->json($company);
    }

    public function getResolvedTestStatsByCompany(Request $request)
    {
        $companyId = $request->company_id;

        $results = DB::table('companies')
            ->join('tests', 'tests.company_id', '=', 'companies.id')
            ->join('qcm_for_roadmaps', 'qcm_for_roadmaps.id', '=', 'tests.qcm_id')
            ->join('results', 'results.qcm_for_roadmapId', '=', 'qcm_for_roadmaps.id')
            ->join('candidates', 'candidates.id', '=', 'results.candidate_id')
            ->join('profile_candidates', 'profile_candidates.candidate_id', '=', 'candidates.id')
            ->select(
                'companies.id as company_id',
                'companies.name as company_name',
                DB::raw('COUNT(DISTINCT results.id) as resolved_tests_count'),
                'candidates.id as candidate_id',
                'candidates.name as candidate_name',
                'profile_candidates.field',
                'profile_candidates.localisation',
                'profile_candidates.photoProfil'
            )
            ->where('companies.id', $companyId)
            ->groupBy(
                'companies.id',
                'companies.name',
                'candidates.id',
                'candidates.name',
                'profile_candidates.field',
                'profile_candidates.localisation',
                'profile_candidates.photoProfil'
            )
            ->get();

        return response()->json($results);
    }

    public function getAcceptedCandidatesByCompany(Request $request)
    {
        $companyId = $request->company_id;

        $acceptedCandidates = DB::table('companies')
            ->join('notifications', 'notifications.company_id', '=', 'companies.id')
            ->join('candidates', 'candidates.id', '=', 'notifications.candidate_id')
            ->join('profile_candidates', 'profile_candidates.candidate_id', '=', 'candidates.id')
            ->where('notifications.message', 'like', '%accepted%')
            ->where('companies.id', $companyId)
            ->select(
                'companies.id as company_id',
                'companies.name as company_name',
                'candidates.id as candidate_id',
                'candidates.name as candidate_name',
                'candidates.email',
                'profile_candidates.last_name',
                'profile_candidates.field',
                'profile_candidates.localisation',
                'profile_candidates.phoneNumber',
                'profile_candidates.photoProfil',
                'profile_candidates.experience',
                'profile_candidates.formation',
                'profile_candidates.competenceList'
            )
            ->get();

        // Get accepted candidate count for this company
        $acceptedCount = DB::table('notifications')
            ->where('message', 'like', '%accepted%')
            ->where('company_id', $companyId)
            ->distinct('candidate_id')
            ->count('candidate_id');

        $acceptedCandidates->transform(function ($item) use ($acceptedCount) {
            $item->accepted_candidates_count = $acceptedCount;
            return $item;
        });

        return response()->json($acceptedCandidates);
    }
    public function getCompanyTests(Request $request)
    {
        $companyId = $request->query('company_id');

        if (!$companyId) {
            return response()->json(['error' => 'Company ID is required'], 400);
        }

        $tests = Test::where('company_id', $companyId)
            ->select('id', 'objective', 'prerequisites', 'tools_required', 'before_answer')
            ->get();

        return response()->json($tests);
    }
}
