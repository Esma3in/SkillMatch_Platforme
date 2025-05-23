<?php

namespace App\Http\Controllers;

use App\Models\Qcm;
use App\Models\Badge;
use App\Models\Roadmap;
use Illuminate\Http\Request;
use App\Models\QcmForRoadmap;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

        $skill_names = $roadmap_skills->pluck('skill_name')->toArray();
        $results = [];

        // Step 2: Load QCM questions from JSON file
        $jsonPath = base_path('database/data/json/QcmForRoadmap.json');
    
        if (!file_exists($jsonPath)) {
            return response()->json(['message' => 'QCM JSON file not found at ' . $jsonPath], 500);
        }
        $jsonContent = file_get_contents($jsonPath);
        $qcmData = json_decode($jsonContent, true);
        if (!$qcmData) {
            return response()->json(['message' => 'Invalid QCM JSON file'], 500);
        }

        // Step 3: Get random questions per skill in the roadmap
        foreach ($skill_names as $skill_name) {
            if (isset($qcmData[$skill_name])) {
                $questions = $qcmData[$skill_name];
                shuffle($questions);
                $selected = array_slice($questions, 0, 10);
                foreach ($selected as $q) {
                    $results[] = [
                        'question' => $q['question'],
                        'options' => $q['options'],
                        'correct_answer' => $q['correctAnswer'],
                        'skill_name' => $skill_name,
                        'type' => 'core'
                    ];
                }
            }
        }

        // Step 4: Add advanced questions as challenges (from other skills)
        $other_skills = array_diff(array_keys($qcmData), $skill_names);
        $advanced_questions = [];
        foreach ($other_skills as $other_skill) {
            $questions = $qcmData[$other_skill];
            shuffle($questions);
            $advanced_questions = array_merge($advanced_questions, array_slice($questions, 0, 2));
        }
        shuffle($advanced_questions);
        $advanced_questions = array_slice($advanced_questions, 0, 5);
        foreach ($advanced_questions as $q) {
            $results[] = [
                'question' => $q['question'],
                'options' => $q['options'],
                'correct_answer' => $q['correctAnswer'],
                'skill_name' => 'advanced',
                'type' => 'advanced'
            ];
        }

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

    // Create a new QCM for roadmap
    public function createQcm(Request $request)
    {
        $request->validate([
            'roadmap_id' => 'required|exists:roadmaps,id',
        ]);
    
        $qcm = new QcmForRoadmap();
        $qcm->roadmap_id = $request->roadmap_id;
        $qcm->save();
    
        return response()->json([
            'id' => $qcm->id,
            'message' => 'QCM created'
        ], 201);
    }
    public function saveResults(Request $request)
    {
        try {
            $validated = $request->validate([
                'score' => 'required|numeric|between:0,100',
                'candidateAnswer' => 'required', // Validate as JSON string
                'correctAnswer' => 'required', // Validate as JSON string
                'candidate_id' => 'required|exists:candidates,id',
                'qcm_for_roadmapId' => 'required|exists:qcm_for_roadmaps,id',
            ]);

            // Check for existing result to prevent duplicates (optional, uncomment if needed)
            /*
            $existingResult = DB::table('results')
                ->where('candidate_id', $validated['candidate_id'])
                ->where('qcm_for_roadmap_id', $validated['qcm_for_roadmap_id'])
                ->exists();

            if ($existingResult) {
                return response()->json([
                    'success' => false,
                    'message' => 'Result already exists for this candidate and QCM'
                ], 422);
            }
            */

            $result = DB::table('results')->insert([
                'score' => $validated['score'],
                'candidateAnswer' => $validated['candidateAnswer'],
                'correctAnswer' => $validated['correctAnswer'],
                'candidate_id' => $validated['candidate_id'],
                'qcm_for_roadmapId' => $validated['qcm_for_roadmapId'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => $result,
                'message' => $result ? 'Results saved successfully' : 'Failed to save results'
            ], $result ? 201 : 422);
        } catch (\Exception $e) {
            Log::error('Failed to save results', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while saving results: ' . $e->getMessage() // Include error for debugging
            ], 500);
        }
    }

    public function getIdRoadmap(int $id)
    {
        $roadmap = QcmForRoadmap::find($id);

        if (!$roadmap) {
            return response()->json([
                'success' => false,
                'message' => 'QCM not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $roadmap
        ], 200);
    }
}


