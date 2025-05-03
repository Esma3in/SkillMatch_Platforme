<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\Roadmap;
use Illuminate\Http\Request;
use App\Models\CompaniesSelected;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // Count completed roadmaps
    public function countCompletedRoadmaps(Request $request, $candidate_id)
    {
        $count = Roadmap::where('candidate_id', $candidate_id)
                        ->where('completed', 'completed')
                        ->count();
        // Placeholder: Calculate change (e.g., compared to previous period)
        $change = 0; // Replace with actual logic if available

        return response()->json(['count' => $count, 'change' => $change]);
    }

    // Count selected companies
    public function countSelectedCompanies($candidate_id)
    {
        $count = CompaniesSelected::where('candidate_id', $candidate_id)->count();
        $change = 0; // Replace with actual logic

        return response()->json(['count' => $count, 'change' => $change]);
    }

    // Count matched companies
    public function countMatchedCompaniesBySkill($candidate_id)
    {
        $count = DB::table('companies as c')
            ->join('companies_skills as cs', 'c.id', '=', 'cs.company_id')
            ->whereIn('cs.skill_id', function($query) use ($candidate_id) {
                $query->select('skill_id')
                      ->from('candidates_skills')
                      ->where('candidate_id', $candidate_id);
            })
            ->distinct()
            ->count('c.id');
        $change = 0; // Replace with actual logic

        return response()->json(['count' => $count, 'change' => $change]);
    }

    // Count badges for this candidate
    public function countBadges($candidate_id)
    {
        $count = Badge::where('candidate_id', $candidate_id)->count();
        $change = 0; // Replace with actual logic

        return response()->json(['count' => $count, 'change' => $change]);
    }

    // Count all roadmaps
    public function countAllRoadmaps($candidate_id)
    {
        $count = Roadmap::where('candidate_id', $candidate_id)->count();
        $change = 0; // Replace with actual logic

        return response()->json(['count' => $count, 'change' => $change]);
    }

    // Get roadmap progress for this candidate
    public function getRoadmapsProgressWithCandidates($candidate_id)
    {
        $data = DB::table('roadmapsprogress')
            ->join('roadmaps', 'roadmapsprogress.roadmap_id', '=', 'roadmaps.id')
            ->where('roadmaps.candidate_id', $candidate_id)
            ->select(
                'roadmaps.name as roadmap_name',
                'roadmapsprogress.progress_percentage'
            )
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->roadmap_name ?? 'Unknown',
                    'percentage' => $item->progress_percentage ?? 0,
                ];
            });

        return response()->json($data);
    }

    // Get selected companies with roadmap details
    public function getSelectedCompanies($candidate_id)
    {
        $data = DB::table('companies_selecteds')
            ->join('companies', 'companies.id', '=', 'companies_selecteds.company_id')
            ->join('roadmaps', 'companies_selecteds.candidate_id', '=', 'roadmaps.candidate_id')
            ->leftJoin('badges', 'roadmaps.id', '=', 'badges.roadmap_id')
            ->where('companies_selecteds.candidate_id', $candidate_id)
            ->select(
                'roadmaps.name as roadmap_name',
                'roadmaps.completed as status',
                DB::raw('COUNT(badges.id) as badges_earned'),
                'companies.name as company_name'
            )
            ->groupBy('roadmaps.id', 'companies.name')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->roadmap_name ?? 'Unknown',
                    'status' => $item->status ? 'completed' : 'pending',
                    'badges' => (int) $item->badges_earned,
                    'company' => $item->company_name ?? 'Unknown',
                ];
            });

        return response()->json($data);
    }

    // Get company data for this candidate
    public function getFullCandidateCompanyData($candidate_id)
    {
        $data = DB::table('companies_selecteds')
            ->join('companies', 'companies_selecteds.company_id', '=', 'companies.id')
            ->where('companies_selecteds.candidate_id', $candidate_id)
            ->select(
                'companies.name',
                'companies.email',
                'companies.image_url as image'
            )
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name ?? 'Unknown',
                    'email' => $item->email ?? 'N/A',
                    'image' => $item->image ?? '/default-image.png',
                ];
            });

        return response()->json($data);
    }

    // Get challenges for this candidate
    public function getCandidateChallenges($candidate_id)
    {
        $data = DB::table('challenges')
            ->join('candidate_challenge', 'challenges.id', '=', 'candidate_challenge.challenge_id')
            ->where('candidate_challenge.candidate_id', $candidate_id)
            ->select(
                'challenges.name as challenge_name',
                'candidate_challenge.progress_percentage'
            )
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->challenge_name ?? 'Unknown',
                    'percentage' => $item->progress_percentage ?? 0,
                ];
            });

        return response()->json($data);
    }

    // Get tests for this candidate
    public function getTestsByCandidate($candidate_id)
    {
        $data = DB::table('tests')
            ->join('companies_selecteds', 'tests.company_id', '=', 'companies_selecteds.company_id')
            ->where('companies_selecteds.candidate_id', $candidate_id)
            ->select(
                'tests.name as test_name',
                'tests.progress_percentage' // Adjust if progress is stored elsewhere
            )
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->test_name ?? 'Unknown',
                    'percentage' => $item->progress_percentage ?? 0,
                ];
            });

        return response()->json($data);
    }
}