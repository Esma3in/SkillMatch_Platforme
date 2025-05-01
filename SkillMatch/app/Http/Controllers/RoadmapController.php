<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Roadmap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoadmapController extends Controller
{
    /**
     * Return all prerequisites for a given roadmap id
     *
     * @param int $roadmap_id The id of the roadmap
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPrerequisites($roadmap_id)
    {
        $prerequisites = DB::table('prerequisites')
            ->where('roadmap_id', $roadmap_id)
            ->get();

        return response()->json([
            'roadmap_id' => $roadmap_id,
            'prerequisites' => $prerequisites
        ]);
    }

    public function getCandidateCourses($roadmap_id)
    {
        $courses = DB::table('candidate_courses')
            ->where('roadmap_id', $roadmap_id)
            ->get();

        return response()->json([
            'roadmap_id' => $roadmap_id,
            'courses' => $courses
        ]);
    }

    public function getSkills($roadmap_id, $skill_type = null)
    {
        $query = DB::table('roadmap_skills')
            ->where('roadmap_id', $roadmap_id);

        if ($skill_type) {
            $query->where('type', $skill_type);
        }

        $skills = $query->get();

        return response()->json([
            'roadmap_id' => $roadmap_id,
            'type' => $skill_type,
            'skills' => $skills
        ]);
    }

    public function getTools($roadmap_id)
    {
        $tools = DB::table('tools')
            ->where('roadmap_id', $roadmap_id)
            ->get();

        $toolsWithSkills = $tools->map(function ($tool) {
            $skills = DB::table('tool_skills')
                ->where('tool_id', $tool->id)
                ->pluck('skill')
                ->toArray();

            $tool->skills = $skills;
            return $tool;
        });

        return response()->json([
            'roadmap_id' => $roadmap_id,
            'tools' => $toolsWithSkills
        ]);
    }

    public function updatePrerequisite(Request $request, $prerequisite_id)
    {
        $validated = $request->validate([
            'completed' => 'required|boolean',
        ]);

        DB::table('prerequisites')
            ->where('id', $prerequisite_id)
            ->update([
                'completed' => $validated['completed'],
                'updated_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Prerequisite updated successfully'
        ]);
    }

    public function updateCourse(Request $request, $course_id)
    {
        $validated = $request->validate([
            'completed' => 'required|boolean',
        ]);

        DB::table('candidate_courses')
            ->where('id', $course_id)
            ->update([
                'completed' => $validated['completed'],
                'updated_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully'
        ]);
    }

    public function updateSkill(Request $request, $skill_id)
    {
        $validated = $request->validate([
            'completed' => 'required|boolean',
        ]);

        DB::table('roadmap_skills')
            ->where('id', $skill_id)
            ->update([
                'completed' => $validated['completed'],
                'updated_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Skill updated successfully'
        ]);
    }

    //compare skills company and skills json
    public function getSkillsRoadmapFromJson($company_id)
    {
        $company = Company::with('skills')->find($company_id);
        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        $companySkills = $company->skills->pluck('name')->map(fn($s) => strtolower($s))->toArray();

        $jsonPaths = [
            'prerequisites' => database_path('data/json/prerequisites.json'),
                'courses' => database_path('data/json/candidateCourses.json'),
                'skills' => database_path('data/json/skills.json'),
                'tools' => database_path('data/json/tools.json'),
        ];

        $jsonData = [];
        foreach ($jsonPaths as $key => $path) {
            if (!file_exists($path)) {
                return response()->json(['error' => "$key file not found"], 500);
            }
            $jsonData[$key] = json_decode(file_get_contents($path), true);
        }

        $matchedTechs = [];
        foreach ($jsonData['skills'] as $tech => $skills) {
            if (in_array(strtolower($tech), $companySkills)) {
                $matchedTechs[$tech] = [
                    'skills' => $skills,
                    'prerequisites' => array_values(array_filter(
                        $jsonData['prerequisites'],
                        fn($item) => strtolower($item['skill']) === strtolower($tech)
                    )),
                    'courses' => array_values(array_filter(
                        $jsonData['courses']['courses'] ?? [],
                        fn($course) => isset($course['technology']) && strtolower($course['technology']) === strtolower($tech)
                    )),
                    'tools' => array_values(array_filter(
                        $jsonData['tools']['tools'] ?? [],
                        fn($tool) => isset($tool['technology']) && strtolower($tool['technology']) === strtolower($tech)
                    )),
                ];
            }
        }

        return response()->json([
            'company_id' => $company->id,
            'roadmap_by_tech' => $matchedTechs
        ]);
    }


    public function getRoadmap()
    {
        $roadmap = Roadmap::all();

        if (!$roadmap) {
            return response()->json([
                'success' => false,
                'message' => 'Roadmap not found'
            ], 404);
        }

        // Fetch all associated roadmap data
        // $prerequisitesRaw = DB::table('prerequisites')->get()->groupBy('skill');
        // $transformedPrerequisites = [];
        // foreach ($prerequisitesRaw as $skill => $items) {
        //     $transformedPrerequisites[] = [
        //         'skill' => $skill,
        //         'prerequisites' => $items
        //     ];
        // }

        // $courses = DB::table('candidate_courses')->get();
        // $skills = DB::table('roadmap_skills')->get()->groupBy('type');

        // $tools = DB::table('tools')->get();
        // $toolsWithSkills = $tools->map(function ($tool) {
        //     $tool->skills = DB::table('tool_skills')
        //         ->where('tool_id', $tool->id)
        //         ->pluck('skill')
        //         ->toArray();
        //     return $tool;
        // });

        return response()->json($roadmap);
    }
}
