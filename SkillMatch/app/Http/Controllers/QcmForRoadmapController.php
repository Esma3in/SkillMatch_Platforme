<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QcmForRoadmapController extends Controller
{
    // Get QCM for roadmap
    public function index($id)
    {
        // Fetch roadmap skills first to get relevant skills
        $roadmap_skills = DB::table('roadmap_skill')
            ->join('roadmaps', 'roadmaps.id', '=', 'roadmap_skill.roadmap_id')
            ->join('skills', 'skills.id', '=', 'roadmap_skill.skill_id')
            ->where('roadmaps.id', $id)
            ->select('skills.id as skill_id', 'skills.name as skill_name')
            ->distinct()
            ->get();

        // Fetch candidate courses for this roadmap (via roadmap -> candidateCourses relationship)
        $candidate_courses = DB::table('roadmap_skill')
            ->join('roadmaps', 'roadmaps.id', '=', 'roadmap_skill.roadmap_id')
            ->join('skills', 'skills.id', '=', 'roadmap_skill.skill_id')
            ->join('candidate_courses', 'candidate_courses.name', 'LIKE', DB::raw('CONCAT("%", skills.name, "%")'))
            ->where('roadmaps.id', $id)
            ->select(
                'candidate_courses.id as course_id',
                'candidate_courses.name as course_name',
                'skills.id as skill_id',
                'skills.name as skill_name'
            )
            ->distinct()
            ->get();

        // Extract skills from candidate courses if not already in roadmap_skills
        $all_skills = $roadmap_skills->pluck('skill_name', 'skill_id')->toArray();
        $additional_skills = [];

        foreach ($candidate_courses as $course) {
            // Skip if skill is already in roadmap_skills
            if (isset($all_skills[$course->skill_id])) {
                continue;
            }

            $all_skills[$course->skill_id] = $course->skill_name;
        }

        // If no courses found, fallback to skills-based questions
        if (empty($candidate_courses)) {
            $candidate_courses = collect($all_skills)->map(function ($skill_name, $skill_id) {
                return (object) [
                    'course_id' => null,
                    'course_name' => 'General',
                    'skill_id' => $skill_id,
                    'skill_name' => $skill_name,
                ];
            })->toArray();
        }

        // Fetch questions for each course/skill
        $results = [];
        foreach ($candidate_courses as $course) {
            $questions = DB::table('qcm_for_roadmaps')
                ->join('skills', 'skills.id', '=', 'qcm_for_roadmaps.skill_id')
                ->where('qcm_for_roadmaps.skill_id', $course->skill_id)
                ->select(
                    'qcm_for_roadmaps.id',
                    'qcm_for_roadmaps.question',
                    'qcm_for_roadmaps.options',
                    'qcm_for_roadmaps.correct_answer',
                    'qcm_for_roadmaps.skill_id',
                    'skills.name as skill_name',
                    DB::raw("'" . ($course->course_id ?? null) . "' as course_id"),
                    DB::raw("'" . $course->course_name . "' as course_name")
                )
                ->inRandomOrder() // Randomize questions
                ->limit(3) // Limit to 3 questions per course
                ->get();

            $results = array_merge($results, $questions->toArray());
        }

        // If no questions found, return a message
        if (empty($results)) {
            return response()->json(['message' => 'No questions available for the skills in this roadmap'], 200);
        }

        return response()->json($results);
    }
}
