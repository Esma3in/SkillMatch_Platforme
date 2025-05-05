<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        // Step 3: Add advanced (non-matching) questions as challenges
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

}//test
