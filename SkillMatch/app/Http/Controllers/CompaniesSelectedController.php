<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use App\Models\Skill;
use App\Models\Company;
use App\Models\Roadmap;
use App\Models\Candidate;
use App\Models\Prerequiste;
use App\Models\SkillRoadmap;
use Illuminate\Http\Request;
use App\Models\CandidateCourse;
use App\Models\CompaniesSelected;
use App\Models\CompaniesSkills;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CompaniesSelectedController extends Controller
{
    public function selectCompany($company_id, Request $request)
    {
        $user = $request->user();

        // Vérification si le candidat existe
        $company = Candidate::find($company_id);
        if (!$company) {
            return response()->json(['error' => 'company not found'], 404);
        }



        // Validation des données envoyées
        $validated = $request->validate([
            'candidate_id' => 'required|integer|exists:candidates,id',
            'name' => 'required|string',
            'skills' => 'nullable|string',
        ]);

        try {
            // Création de l'entrée dans CompaniesSelected
            $selection = CompaniesSelected::create([
                'candidate_id' => $validated['candidate_id'],
                'company_id' => $company_id,
                'name' => $validated['name'],

                'selected_at' => now(),
            ]);

            return response()->json([
                'message' => 'Company selected successfully',
                'data' => $selection
            ], 201);


        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to select company: ' . $e->getMessage()], 500);
        }
    }

    public function getSkillsByCompany($company_id){
        $company_skills = Company::where('id' , $company_id)->with('skills')->get();
        return response()->json($company_skills);

    }

    public function getSelectedCompanies($candidate_id, Request $request)
    {
        $user = $request->user();

        $candidate = Candidate::find($candidate_id);
        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        if ($user->id !== $candidate->user_id) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        try {
            $selectedCompanies = CompaniesSelected::where('candidate_id', $candidate->id)
                ->with('company') // Eager load the company relationship
                ->get();

            return response()->json($selectedCompanies);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch selected companies: ' . $e->getMessage()], 500);
        }
    }

    /**
 * Retrieve the companies selected by a specific candidate
 *
 * @param int $candidate_id
 * @param \Illuminate\Http\Request $request
 * @return \Illuminate\Http\JsonResponse
 */

public function getSelectedCompaniess($candidate_id, Request $request)
{

    $companiesSelected =CompaniesSelected::whereCandidateId($candidate_id)->with('companies')->get();
    return response()->json($companiesSelected);
}
public function getSkillsData(Request $request, $companyId)
{
    try {
        // Step 1: Fetch skills for the given company ID
        $skills = CompaniesSkills::where('company_id', $companyId)->get();

        if ($skills->isEmpty()) {
            return response()->json(['message' => 'No skills found for this company'], 404);
        }

        $skillIds = $skills->pluck('skill_id')->toArray();

        // Step 2: Fetch prerequisites
        $prerequisites = DB::table('roadmaps')
            ->join('prerequisites', 'roadmaps.skill_id', '=', 'prerequisites.skill_id')
            ->whereIn('roadmaps.skill_id', $skillIds)
            ->select('roadmaps.*', 'prerequisites.*')
            ->get();

        // Step 3: Fetch tools
        $tools = DB::table('tools')
            ->join('skills', 'tools.name', '=', 'skills.name')
            ->join('roadmaps', 'skills.id', '=', 'roadmaps.skill_id')
            ->whereIn('skills.id', $skillIds)
            ->select('tools.*', 'skills.*', 'roadmaps.*')
            ->get();

        // Step 4: Fetch candidate courses
        $candidateCourses = DB::table('candidate_courses')
            ->join('skills', function ($join) {
                $join->on(DB::raw("candidate_courses.name"), 'LIKE', DB::raw("CONCAT('%', skills.name, '%')"))
                     ->orOn(DB::raw("skills.name"), 'LIKE', DB::raw("CONCAT('%', candidate_courses.name, '%')"));
            })
            ->join('roadmaps', 'skills.id', '=', 'roadmaps.skill_id')
            ->select('candidate_courses.*', 'skills.*', 'roadmaps.*')
            ->get();

        // Step 5: Fetch roadmap skills
        $roadmapSkills = DB::table('roadmap_skills')
            ->join('skills', function ($join) {
                $join->on(DB::raw("roadmap_skills.text"), 'LIKE', DB::raw("CONCAT('%', skills.name, '%')"))
                     ->orOn(DB::raw("skills.name"), 'LIKE', DB::raw("CONCAT('%', roadmap_skills.text, '%')"));
            })
            ->join('roadmaps', 'skills.id', '=', 'roadmaps.skill_id')
            ->select('roadmap_skills.*', 'skills.*', 'roadmaps.*')
            ->get();

        // Step 6: Return structured response
        return response()->json([
            'skills'            => $skills,
            'message'           => "Skills generated successfully",
            'prerequisites'     => $prerequisites,
            'tools'             => $tools,
            'candidateCourses'  => $candidateCourses,
            'roadmapSkills'     => $roadmapSkills,
        ]);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Internal server error'], 500);
    }
}

}
//testetestestest
