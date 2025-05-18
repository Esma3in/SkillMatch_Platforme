<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\Result;
use App\Models\Candidate;
use Illuminate\Http\Request;
use App\Models\QcmForRoadmap;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BadgeController extends Controller
{
    public function getBadges(Request $request, $candidateId)
    {
        try {
            // Validate candidateId
            if (!is_numeric($candidateId) || $candidateId <= 0) {
                Log::warning('Invalid candidate ID provided:', ['candidateId' => $candidateId]);
                return response()->json([
                    'error' => 'Invalid candidate ID',
                ], 400);
            }

            // Fetch badges with related data, selecting unique columns
            $badges = DB::table('badges')
                ->join('results', function ($join) use ($candidateId) {
                    $join->on('badges.qcm_for_roadmap_id', '=', 'results.qcm_for_roadmapId')
                         ->where('results.candidate_id', '=', $candidateId);
                })
                ->leftJoin('companies_selecteds', 'badges.candidate_id', '=', 'companies_selecteds.candidate_id')
                ->leftJoin('profile_companies', 'companies_selecteds.company_id', '=', 'profile_companies.company_id')
                ->leftJoin('companies', 'profile_companies.company_id', '=', 'companies.id')
                ->where('badges.candidate_id', $candidateId)
                ->select(
                    // Badge fields (unique)
                    'badges.id as badge_id',
                    'badges.name as badge_name',
                    'badges.icon as badge_icon',
                    'badges.description as badge_description',
                    'badges.date_obtained as badge_date_obtained',
                    'badges.created_at as badge_created_at',
                    'badges.updated_at as badge_updated_at',
                    // Result fields (unique)
                    'results.id as result_id',
                    'results.score as result_score',
                    'results.created_at as result_created_at',
                    'results.updated_at as result_updated_at',
                    // Company fields (optional, from LEFT JOIN)
                    'companies.id as company_id',
                    'companies.name as company_name', // Assuming 'name' exists; adjust if different
                    'companies.created_at as company_created_at',
                    'companies.updated_at as company_updated_at'
                )
                ->distinct() // Ensure no duplicate rows
                ->get();

            // Check if badges exist
            if ($badges->isEmpty()) {
                Log::info('No badges found for candidate:', ['candidateId' => $candidateId]);
                return response()->json([
                    'message' => 'No badges found for this candidate',
                    'data' => [],
                ], 200);
            }

            // Format the response to match frontend expectations
            $formattedBadges = $badges->map(function ($badge) {
                return [
                    'id' => $badge->badge_id,
                    'name' => $badge->badge_name,
                    'icon' => $badge->badge_icon,
                    'description' => $badge->badge_description,
                    'date_obtained' => $badge->badge_date_obtained,
                    'created_at' => $badge->badge_created_at,
                    'updated_at' => $badge->badge_updated_at,
                    'result' => [
                        'id' => $badge->result_id,
                        'score' => $badge->result_score,
                        'created_at' => $badge->result_created_at,
                        'updated_at' => $badge->result_updated_at,
                    ],
                    'company' => $badge->company_id ? [
                        'id' => $badge->company_id,
                        'name' => $badge->company_name,
                        'created_at' => $badge->company_created_at,
                        'updated_at' => $badge->company_updated_at,
                    ] : null,
                ];
            })->values()->toArray(); // Reset array keys

            Log::info('Badges retrieved successfully:', ['candidateId' => $candidateId, 'count' => $badges->count()]);

            return response()->json([
                'message' => 'Badges retrieved successfully',
                'data' => $formattedBadges,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching badges:', [
                'candidateId' => $candidateId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'An error occurred while fetching badges',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
   // get result for an qcmrodamap id
   public function QcmResult($qcmForRoadmapId){
      $results = Result::where("qcm_for_roadmapId" , $qcmForRoadmapId)->get();
      return response()->json($results);
   }
   public function createBadge(Request $request)
   {
       try {
           // Validate incoming request data
           $validator = Validator::make($request->all(), [
               'candidate_id' => 'required|exists:candidates,id',
               'qcm_for_roadmap_id' => 'required|exists:qcm_for_roadmaps,id',
               'name' => 'required|string|max:255',
               'icon' => 'required|url',
               'description' => 'required|string',
               'Date_obtained' => 'required|date_format:Y-m-d',
           ]);

           if ($validator->fails()) {
               Log::warning('Badge creation validation failed:', ['errors' => $validator->errors()]);
               return response()->json([
                   'message' => 'Validation failed',
                   'error' => $validator->errors(),
               ], 422);
           }

           // Check if badge already exists for this candidate and roadmap
           $existingBadge = Badge::where('candidate_id', $request->candidate_id)
               ->where('qcm_for_roadmap_id', $request->qcm_for_roadmap_id)
               ->first();

           if ($existingBadge) {
               Log::warning('Duplicate badge attempt:', [
                   'candidate_id' => $request->candidate_id,
                   'qcm_for_roadmap_id' => $request->qcm_for_roadmap_id,
               ]);
               return response()->json([
                   'message' => 'Badge already exists for this candidate and roadmap',
                   'error' => 'Duplicate badge entry',
               ], 409);
           }

           // Verify candidate and qcm_for_roadmap exist
           $candidate = Candidate::findOrFail($request->candidate_id);
           $qcmRoadmap = QcmForRoadmap::with('roadmap')->findOrFail($request->qcm_for_roadmap_id);

           // Verify the roadmap exists and belongs to the candidate
      

           // Create badge and update roadmap within a transaction
           DB::beginTransaction();

           $badge = Badge::create([
               'candidate_id' => $request->candidate_id,
               'qcm_for_roadmap_id' => $request->qcm_for_roadmap_id,
               'name' => $request->name,
               'icon' => $request->icon,
               'description' => $request->description,
               'Date_obtained' => $request->Date_obtained,
           ]);

           // Update roadmap completed status
           $qcmRoadmap->roadmap->update(['completed' => "completed"]);

           DB::commit();

           Log::info('Badge created and roadmap marked as completed:', [
               'badge_id' => $badge->id,
               'roadmap_id' => $qcmRoadmap->roadmap->id,
           ]);

           return response()->json([
               'message' => 'Badge created successfully! you completed this roadmap',
               'data' => $badge,
           ], 201);

       } catch (\Exception $e) {
           DB::rollBack();
           Log::error('Failed to create badge:', [
               'error' => $e->getMessage(),
               'request' => $request->all(),
               'trace' => $e->getTraceAsString(),
           ]);

           return response()->json([
               'message' => 'Failed to create badge',
               'error' => $e->getMessage(),
           ], 500);
       }
   }

}
