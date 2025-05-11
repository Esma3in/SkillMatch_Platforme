<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\Result;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
   public function getBadges($candidate_id)
   {
       try {
           // Validate candidate_id
           if (!is_numeric($candidate_id) || $candidate_id <= 0) {
               return response()->json([
                   'error' => 'Invalid candidate ID'
               ], 400);
           }
   
           // Fetch badges with related QcmForRoadmap and Results data
           $badges = Badge::with([
               'qcmForRoadmap' => function ($query) {
                   // Select relevant fields from qcm_for_roadmaps
                   $query->select('id', 'question', 'created_at', 'updated_at');
               },
               'qcmForRoadmap.result' => function ($query) use ($candidate_id) {
                   // Select relevant fields from results and filter by candidate_id
                   $query->where('candidate_id', $candidate_id)
                         ->select('id', 'qcm_for_roadmap_id', 'candidate_id', 'score', 'created_at', 'updated_at');
               }
           ])
               ->where('candidate_id', $candidate_id)
               ->get();
   
           // Check if badges exist
           if ($badges->isEmpty()) {
               return response()->json([
                   'message' => 'No badges found for this candidate',
                   'data' => []
               ], 200);
           }
   
           // Transform the response to include badge, QcmForRoadmap, and Results details
           $formattedBadges = $badges->map(function ($badge) {
               return [
                   'id' => $badge->id,
                   'name' => $badge->name,
                   'icon' => $badge->icon,
                   'description' => $badge->description,
                   'date_obtained' => $badge->date_obtained,
                   'qcm_for_roadmap' => $badge->qcmForRoadmap ? [
                       'id' => $badge->qcmForRoadmap->id,
                       'question' => $badge->qcmForRoadmap->question,
                       'created_at' => $badge->qcmForRoadmap->created_at,
                       'updated_at' => $badge->qcmForRoadmap->updated_at,
                       'result' => $badge->qcmForRoadmap->result ? [
                           'id' => $badge->qcmForRoadmap->result->id,
                           'score' => $badge->qcmForRoadmap->result->score, // Score from results table
                           'created_at' => $badge->qcmForRoadmap->result->created_at,
                           'updated_at' => $badge->qcmForRoadmap->result->updated_at,
                       ] : null,
                   ] : null,
               ];
           });
   
           return response()->json([
               'message' => 'Badges retrieved successfully',
               'data' => $formattedBadges
           ], 200);
   
       } catch (\Exception $e) {
           return response()->json([
               'error' => 'An error occurred while fetching badges',
               'message' => $e->getMessage()
           ], 500);
       }
   }
   // get result for an qcmrodamap id
   public function QcmResult($qcmForRoadmapId){
      $results = Result::where("qcm_for_roadmapId" , $qcmForRoadmapId)->get();
      return response()->json($results);
   }

}
