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
        $companyId = $request->query('company_id');

        $testCount = Company::withCount('tests')
            ->where('id', $companyId)
            ->first();

        return response()->json($testCount);
    }

    public function getSelectedCandidatesByCompany(Request $request)
    {
        $companyId = $request->query('company_id');

        $company = Company::withCount('selectedCandidates')
            ->with([
                'selectedCandidates.candidate' => function ($query) {
                    $query->select('id', 'name', 'email'); // candidate fields
                },
                'selectedCandidates.candidate.profile' => function ($query) {
                    $query->select(
                        'id',
                        'candidate_id', // always needed for hasOne relation
                        'last_name',
                        'field',
                        'localisation',
                        'phoneNumber',
                        'photoProfil',
                        'experience',
                        'formation',
                        'competenceList',
                        'description',
                        'projects',
                        'file'
                    );
                },
                'selectedCandidates.candidate.tests'
            ])
            ->where('id', $companyId)
            ->first();

        return response()->json($company);
    }


    public function getResolvedTestStatsByCompany(Request $request)
    {
        $companyId = $request->query('company_id');

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
        $companyId = $request->query('company_id');
        if (!$companyId) {
            return response()->json(['error' => 'company_id is required'], 400);
        }

        $acceptedCandidates = DB::table('companies')
            ->join('notifications', 'notifications.company_id', '=', 'companies.id')
            ->join('candidates', 'candidates.id', '=', 'notifications.candidate_id')
            ->where('notifications.message', 'like', '%accepted%')
            ->when($companyId, function ($query, $companyId) {
                return $query->where('companies.id', $companyId);
            })
            ->select(
                'companies.id as company_id',
                'companies.name as company_name',
                'candidates.id as candidate_id',
                'candidates.name as candidate_name',
                'candidates.email'
            )
            ->distinct()
            ->get();

        return response()->json($acceptedCandidates);
    }


    public function getCompanyTests(Request $request)
    {
        $companyId = $request->query('company_id');

        if (!$companyId) {
            return response()->json(['error' => 'Company ID is required'], 400);
        }

        $tests = Test::where('company_id', $companyId)
            ->select('id', 'objective', 'prerequisites', 'tools_required', 'before_answer', 'created_at')
            ->get();

        return response()->json($tests);
    }

    public function getCompanySkills($companyId)
    {
        $count = DB::table('companies as c')
        ->join('companies_skills as cs', 'cs.company_id', '=', 'c.id')
        ->join('skills as s', 's.id', '=', 'cs.skill_id')
        ->where('c.id', $companyId)
        ->count();

        return response()->json(['skills_count' => $count]);
    }
}
