<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\Result;
use App\Models\Roadmap;
use App\Models\Candidate;
use Illuminate\Http\Request;
use App\Models\QcmForRoadmap;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BadgeController extends Controller
{
    public function getBadges($candidate_id)
    {
        try {
            $badges = DB::table('badges')
                ->select(
                    'companies.name as company_name',
                    'badges.*',
                    'qcm_for_roadmaps.*',
                    'results.score',
                    'candidates.name as candidate_name'
                )
                ->join('candidates', 'badges.candidate_id', '=', 'candidates.id')
                ->join('companies_selecteds', 'companies_selecteds.candidate_id', '=', 'badges.candidate_id')
                ->join('companies', 'companies.id', '=', 'companies_selecteds.company_id')
                ->join('qcm_for_roadmaps', 'badges.qcm_for_roadmap_id', '=', 'qcm_for_roadmaps.id')
                ->join('results', 'qcm_for_roadmaps.id', '=', 'results.qcm_for_roadmapId')
                ->where('badges.candidate_id', $candidate_id)
                ->limit(3)
                ->get();
    
            return response()->json([
                'success' => true,
                'data' => $badges
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve badges', [
                'error' => $e->getMessage()
            ]);
    
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving badges'
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
           $validator = Validator::make($request->all(), [
               'candidate_id' => 'required|exists:candidates,id',
               'qcm_for_roadmap_id' => 'required|exists:qcm_for_roadmaps,id',
               'name' => 'required|string|max:255',
               'icon' => 'required|url',
               'description' => 'required|string',
               'Date_obtained' => 'required|date_format:Y-m-d', // consider renaming to date_obtained
           ]);
   
           if ($validator->fails()) {
               Log::warning('Badge creation validation failed:', ['errors' => $validator->errors()]);
               return response()->json([
                   'message' => 'Validation failed',
                   'error' => $validator->errors(),
               ], 422);
           }
   
           $candidateId = $request->candidate_id;
           $qcmId = $request->qcm_for_roadmap_id;
   
           $existingBadge = Badge::where('candidate_id', $candidateId)
               ->where('qcm_for_roadmap_id', $qcmId)
               ->first();
   
           if ($existingBadge) {
               Log::warning('Duplicate badge attempt:', [
                   'candidate_id' => $candidateId,
                   'qcm_for_roadmap_id' => $qcmId,
               ]);
               return response()->json([
                   'message' => 'Badge already exists for this candidate and roadmap',
                   'error' => 'Duplicate badge entry',
               ], 409);
           }
   
           $qcmRoadmap = QcmForRoadmap::with('roadmap')->findOrFail($qcmId);
   
           if (!$qcmRoadmap->roadmap) {
               Log::warning('Roadmap not found for QcmForRoadmap:', ['qcm_for_roadmap_id' => $qcmId]);
               return response()->json([
                   'message' => 'Associated roadmap not found',
                   'error' => 'Roadmap not found',
               ], 404);
           }
   
           if ($qcmRoadmap->roadmap->candidate_id !== $candidateId) {
               Log::warning('Unauthorized roadmap access:', [
                   'candidate_id' => $candidateId,
                   'roadmap_id' => $qcmRoadmap->roadmap->id,
               ]);
               return response()->json([
                   'message' => 'Unauthorized access to this roadmap',
                   'error' => 'Unauthorized',
               ], 403);
           }
   
           DB::beginTransaction();
   
           $badge = Badge::create([
               'candidate_id' => $candidateId,
               'qcm_for_roadmap_id' => $qcmId,
               'name' => $request->name,
               'icon' => $request->icon,
               'description' => $request->description,
               'Date_obtained' => $request->Date_obtained,
           ]);
   
           $roadmap = $qcmRoadmap->roadmap;
           $roadmap->completed = 'completed';
           $roadmap->save();
   
           DB::commit();
   
           Log::info('Badge created and roadmap marked as completed:', [
               'badge_id' => $badge->id,
               'roadmap_id' => $roadmap->id,
           ]);
   
           return response()->json([
               'message' => 'Badge created successfully! You completed this roadmap',
               'data' => $badge,
               'roadmap' => [
                   'id' => $roadmap->id,
                   'name' => $roadmap->name,
                   'completed' => $roadmap->completed,
               ],
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
