<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\Roadmap;
use Illuminate\Http\Request;
use App\Models\CompaniesSelected;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
        // counting roadmap completed
        public function countCompletedRoadmaps(Request $request ,$candidate_id)
            {
                $count = Roadmap::where('candidate_id', $candidate_id)->where("completed" , "completed")
                                ->count();

                return response()->json(['completed_count' => $count]);
            }
    //counting companies selected
            public function countSelectedCompanies($candidate_id)
            {
                $count = CompaniesSelected::where('candidate_id', $candidate_id)->count();
            
                return response()->json(['selected_companies_count' => $count]);
            }

            // counting matched companies
            public function countMatchedCompaniesBySkill($candidate_id)
            {
                $count =    DB::table('companies as c')
                    ->join('companies_skills as cs', 'c.id', '=', 'cs.company_id')
                    ->whereIn('cs.skill_id', function($query) use ($candidate_id) {
                        $query->select('skill_id')
                            ->from('candidates_skills')
                            ->where('candidate_id', $candidate_id);
                    })
                    ->count('c.id');

                return response()->json(['matched_companies_count' => $count]);
            }

        //count badges of this candidate 
        public function countBadges($candidate_id)
            {
                $count = Badge::where('candidate_id', $candidate_id)->count();

                return response()->json(['badge_count' => $count]);
            }
    // counting the following roadmap
        public function countAllRoadmaps($candidate_id)
            {
                $count = Roadmap::where('candidate_id', $candidate_id)->count();

                return response()->json(['roadmap_count' => $count]);
            }
        // getting the roadmapprogress of roadmaps of  this candidate 
        public function getRoadmapsProgressWithCandidates($candidate_id)
        {
            $data = DB::table('roadmapsprogress')
                ->join('roadmaps', 'roadmapsprogress.roadmap_id', '=', 'roadmaps.id')
                ->join('candidates', 'candidates.id', '=', 'roadmaps.candidate_id')
                ->where('candidates.id', $candidate_id)  // Filter by candidate_id
                ->select('roadmapsprogress.*', 'roadmaps.*', 'candidates.*')
                ->get();
        
            return response()->json($data);
        }
        // getting the companies selected with company informtion by this candidate 
        public function getSelectedCompanies($candidate_id)
        {
            $data = DB::table('companies_selecteds')
                ->join('candidates', 'candidates.id', '=', 'companies_selecteds.candidate_id')
                ->join('companies', 'companies.id', '=', 'companies_selecteds.company_id')
                ->where('companies_selecteds.candidate_id', $candidate_id)  // Filter by candidate_id
                ->select('companies_selecteds.*', 'candidates.*', 'companies.*')
                ->get();
        
            return response()->json($data);
        }
    // get the roadmpa details list of an company including badge and company informations 
    public function getFullCandidateCompanyData($candidate_id)
    {
        $data = DB::table('companies_selecteds')
            ->join('companies', 'companies_selecteds.company_id', '=', 'companies.id')
            ->join('candidates', 'companies_selecteds.candidate_id', '=', 'candidates.id')
            ->join('roadmaps', 'candidates.id', '=', 'roadmaps.candidate_id')
            ->join("qcm_for_roadmaps" , 'qcm_for_roadmaps.roadmap_id' , '=' , 'roadmaps.id')
            ->join('badges', 'qcm_for_roadmaps.id', '=', 'badges.qcm_for_roadmap_id')
            ->where('companies_selecteds.candidate_id', $candidate_id)  // Filter by candidate_id
            ->select(
                'companies_selecteds.*',
                'companies.name as company_name',
                'candidates.name as candidate_name',
                'roadmaps.name as roadmap_name',
                'badges.name as badge_name',
                'badges.*'
            )
            ->get();
    
        return response()->json($data);
    }
        // challenges info for this candidate 
        public function getCandidateChallenges($candidate_id)
        {
            $data = DB::table('challenges')
                ->join('candidate_challenge', 'challenges.id', '=', 'candidate_challenge.challenge_id')
                ->where('candidate_challenge.candidate_id', $candidate_id)
                ->select('challenges.*', 'candidate_challenge.*') // Adjust fields as needed
                ->get();

            return response()->json($data);
        }
        // tests of company selected by this candidate 
        public function getTestsByCandidate($candidate_id)
        {
            $data = DB::table('tests')
                ->join('companies_selecteds', 'tests.company_id', '=', 'companies_selecteds.company_id')
                ->where('companies_selecteds.candidate_id', $candidate_id)
                ->select('tests.*', 'companies_selecteds.*') // Optional: refine fields as needed
                ->get();
            return response()->json($data);
        }

        public function getSelectedCompaniesForCandidate($candidateId)
        {
            $data = DB::table('companies_selecteds')
                ->join('profile_companies', 'companies_selecteds.company_id', '=', 'profile_companies.company_id')
                ->join('companies', 'companies.id', '=', 'companies_selecteds.company_id')
                ->where('companies_selecteds.candidate_id', $candidateId)
                ->select('companies_selecteds.*', 'profile_companies.*', 'companies.*') // You can customize this
                ->get();
        
            return response()->json($data);
        }

        /**
         * Get recent activities for a candidate's dashboard
         * Returns activities sorted in descending order (newest first)
         */
        public function getRecentActivities($candidate_id)
        {
            if (!is_numeric($candidate_id)) {
                return response()->json(['message' => 'Invalid candidate_id'], 400);
            }

            // Get recent roadmap progress updates
            $roadmapProgress = DB::table('roadmapsprogress')
                ->join('roadmaps', 'roadmapsprogress.roadmap_id', '=', 'roadmaps.id')
                ->where('roadmaps.candidate_id', $candidate_id)
                ->orderBy('roadmapsprogress.updated_at', 'desc')
                ->select(
                    'roadmaps.id as roadmap_id',
                    'roadmaps.name as roadmap_name',
                    'roadmapsprogress.progress',
                    'roadmapsprogress.updated_at as activity_date'
                )
                ->take(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => 'roadmap_progress',
                        'roadmap_id' => $item->roadmap_id,
                        'roadmap_name' => $item->roadmap_name,
                        'progress' => $item->progress,
                        'time' => Carbon::parse($item->activity_date)->diffForHumans(),
                        'date' => $item->activity_date
                    ];
                });

            // Get recently completed roadmaps
            $completedRoadmaps = DB::table('roadmaps')
                ->where('candidate_id', $candidate_id)
                ->where('roadmaps.completed', 'completed')
                ->orderBy('updated_at', 'desc')
                ->select(
                    'id as roadmap_id',
                    'name as roadmap_name',
                    'updated_at as activity_date'
                )
                ->take(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => 'roadmap_completed',
                        'roadmap_id' => $item->roadmap_id,
                        'roadmap_name' => $item->roadmap_name,
                        'time' => Carbon::parse($item->activity_date)->diffForHumans(),
                        'date' => $item->activity_date
                    ];
                });

            // Get recently selected companies
            $selectedCompanies = DB::table('companies_selecteds')
                ->join('companies', 'companies_selecteds.company_id', '=', 'companies.id')
                ->where('companies_selecteds.candidate_id', $candidate_id)
                ->orderBy('companies_selecteds.created_at', 'desc')
                ->select(
                    'companies.id as company_id',
                    'companies.name as company_name',
                    'companies_selecteds.created_at as activity_date'
                )
                ->take(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => 'company_selected',
                        'company_id' => $item->company_id,
                        'company_name' => $item->company_name,
                        'time' => Carbon::parse($item->activity_date)->diffForHumans(),
                        'date' => $item->activity_date
                    ];
                });

            // Get recently earned badges
            $earnedBadges = DB::table('badges')
                ->where('candidate_id', $candidate_id)
                ->orderBy('created_at', 'desc')
                ->select(
                    'id as badge_id',
                    'name as badge_name',
                    'created_at as activity_date'
                )
                ->take(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => 'badge_earned',
                        'badge_id' => $item->badge_id,
                        'badge_name' => $item->badge_name,
                        'time' => Carbon::parse($item->activity_date)->diffForHumans(),
                        'date' => $item->activity_date
                    ];
                });

            // Combine all activities and sort by date (most recent first)
            $allActivities = $roadmapProgress->concat($completedRoadmaps)
                ->concat($selectedCompanies)
                ->concat($earnedBadges)
                ->sortByDesc('date')
                ->values()
                ->take(10);

            return response()->json([
                'message' => 'Recent activities retrieved successfully',
                'data' => $allActivities
            ]);
        }
}
