<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class QcmForRoadmapController extends Controller
{
    // Get QCM for roadmap
    public function index($id)
    {
        // Step 1: Get skills for the roadmap
        $roadmap_skills = DB::table('roadmap_skill')
            ->join('skills', 'skills.id', '=', 'roadmap_skill.skill_id')
            ->where('roadmap_skill.roadmap_id', $id)
            ->select('skills.id as skill_id', 'skills.name as skill_name')
            ->distinct()
            ->get();

        $skill_ids = $roadmap_skills->pluck('skill_id')->toArray();
        $skill_names = $roadmap_skills->pluck('skill_name', 'skill_id')->toArray();

        $results = [];

        // Step 2: Get 3 random questions per skill in the roadmap
        foreach ($skill_ids as $skill_id) {
            $questions = DB::table('qcm_for_roadmaps')
                ->join('skills', 'skills.id', '=', 'qcm_for_roadmaps.skill_id')
                ->where('qcm_for_roadmaps.skill_id', $skill_id)
                ->select(
                    'qcm_for_roadmaps.id',
                    'qcm_for_roadmaps.question',
                    'qcm_for_roadmaps.options',
                    'qcm_for_roadmaps.correct_answer',
                    'qcm_for_roadmaps.skill_id',
                    DB::raw("'core' as type"),
                    'skills.name as skill_name'
                )
                ->inRandomOrder()
                ->limit(10)
                ->get();

            $results = array_merge($results, $questions->toArray());
        }

        // Step 3: Add advanced questions as challenges
        $advanced_questions = DB::table('qcm_for_roadmaps')
            ->join('skills', 'skills.id', '=', 'qcm_for_roadmaps.skill_id')
            ->whereNotIn('qcm_for_roadmaps.skill_id', $skill_ids)
            ->select(
                'qcm_for_roadmaps.id',
                'qcm_for_roadmaps.question',
                'qcm_for_roadmaps.options',
                'qcm_for_roadmaps.correct_answer',
                'qcm_for_roadmaps.skill_id',
                DB::raw("'advanced' as type"),
                'skills.name as skill_name'
            )
            ->inRandomOrder()
            ->limit(5)
            ->get();

        $results = array_merge($results, $advanced_questions->toArray());

        // Final check
        if (empty($results)) {
            return response()->json(['message' => 'No questions found for this roadmap'], 200);
        }

        return response()->json($results);
    }
    // create Badge for QcmRoadmap
    public function storeBadge(Request $request)
    {
        try {
            // Validate the incoming request
            $validated = $request->validate([
                'candidate_id' => 'required|exists:candidates,id',
                'qcm_for_roadmap_id' => 'required|exists:qcm_for_roadmaps,id',
                'name' => 'required|string|max:255',
                'icon' => 'nullable|string',
                'description' => 'nullable|string',
                'Date_obtained' => 'required|date',
            ]);

            // Check if badge already exists for this user and QCM for roadmap
            $existingBadge = DB::table('badges')
                ->where('candidate_id', $validated['candidate_id'])
                ->where('qcm_for_roadmap_id', $validated['qcm_for_roadmap_id'])
                ->where('name', $validated['name'])
                ->where('icon', $validated['icon'])
                ->first();

            if ($existingBadge) {
                return response()->json([
                    'message' => 'Badge already exists for this user and QCM for roadmap'
                ], 409);
            }

            // Create new badge directly using the model
            $badge = Badge::create([
                'candidate_id' => $validated['candidate_id'],
                'qcm_for_roadmap_id' => $validated['qcm_for_roadmap_id'],
                'name' => $validated['name'],
                'icon' => $validated['icon'],
                'description' => $validated['description'],
                'Date_obtained' => $validated['Date_obtained'] ,
            ]);

            return response()->json([
                'message' => 'Badge created successfully',
                'badge' => $badge,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create badge',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}//testtest
