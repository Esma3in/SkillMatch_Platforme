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
    public function getBadges($candidateId)
    {
        if (!is_numeric($candidateId) || $candidateId <= 0) {
            return response()->json(['error' => 'Invalid candidate ID'], 400);
        }
    
        try {
            $badges = DB::table('badges')
                ->join('candidates', 'candidates.id', '=', 'badges.candidate_id')
                ->where('badges.candidate_id', $candidateId)
                ->get();
    
            if ($badges->isEmpty()) {
                return response()->json(['message' => 'No badges found for this candidate', 'data' => []], 200);
            }
    
            return response()->json(['message' => 'Badges retrieved successfully', 'data' => $badges], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred',
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
           if (!$qcmRoadmap->roadmap) {
               Log::warning('Roadmap not found for QcmForRoadmap:', [
                   'qcm_for_roadmap_id' => $request->qcm_for_roadmap_id,
               ]);
               return response()->json([
                   'message' => 'Associated roadmap not found',
                   'error' => 'Roadmap not found',
               ], 404);
           }
   
           if ($qcmRoadmap->roadmap->candidate_id !== $request->candidate_id) {
               Log::warning('Unauthorized roadmap access:', [
                   'candidate_id' => $request->candidate_id,
                   'roadmap_id' => $qcmRoadmap->roadmap->id,
               ]);
               return response()->json([
                   'message' => 'Unauthorized access to this roadmap',
                   'error' => 'Unauthorized',
               ], 403);
           }
   
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
   
           // Update roadmap completed status directly
           $roadmap = Roadmap::findOrFail($qcmRoadmap->roadmap->id);
           $roadmap->completed = 'completed';
           $roadmap->save();
   
           DB::commit();
   
           Log::info('Badge created and roadmap marked as completed:', [
               'badge_id' => $badge->id,
               'roadmap_id' => $qcmRoadmap->roadmap->id,
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
