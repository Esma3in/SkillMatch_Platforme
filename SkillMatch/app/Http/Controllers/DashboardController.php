<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\Roadmap;
use Illuminate\Http\Request;
use App\Models\CompaniesSelected;
use Illuminate\Support\Facades\DB;

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
            ->join('badges', 'roadmaps.id', '=', 'badges.roadmap_id')
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

}
