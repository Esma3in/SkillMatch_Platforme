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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CompaniesSelectedController extends Controller
{
    public function selectCompany($candidate_id, Request $request)
    {
        $user = $request->user();

        // Vérification si le candidat existe
        $candidate = Candidate::find($candidate_id);
        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        // // Vérification que l'utilisateur authentifié est bien le candidat
        // if ($user->id !== $candidate->user_id) {
        //     return response()->json(['error' => 'Unauthorized. You can only select companies for your own profile.'], 403);
        // }

        // Validation des données envoyées
        $validated = $request->validate([
            'company_id' => 'required|integer|exists:companies,id',
            'name' => 'required|string',
            'skills' => 'nullable|string',
        ]);

        try {
            // Création de l'entrée dans CompaniesSelected
            $selection = CompaniesSelected::create([
                'candidate_id' => $candidate->id,
                'company_id' => $validated['company_id'],
                'name' => $validated['name'],

                'selected_at' => now(),
                //
            ]);

            return response()->json([
                'message' => 'Company selected successfully',
                'data' => $selection
            ], 201);


        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to select company: ' . $e->getMessage()], 500);
        }
    }

    public function getCompanySkills($company_id)
    {
        $company = Company::with('skills')->find($company_id);

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        return response()->json([
            'company_id' => $company->id,
            'name' => $company->name,
        ]);
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
    try {
        // Validate the candidate ID
        if (!$candidate_id || !is_numeric($candidate_id)) {
            return response()->json(['error' => 'Invalid candidate ID'], 400);
        }

        $user = $request->user();

        // Check if the candidate exists
        $candidate = Candidate::find($candidate_id);
        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        // Check if the authenticated user is linked to this candidate
        if ($user && $user->id !== $candidate->user_id) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        // Get selected companies with their details
        // Use leftJoin instead of with() to avoid null reference errors
        $companies = DB::table('companies_selected')
            ->where('companies_selected.candidate_id', $candidate_id)
            ->leftJoin('companies', 'companies_selected.company_id', '=', 'companies.id')
            ->select(
                'companies.id',
                'companies.company_name',
                'companies.sector',
                'companies.description',
                'companies.location',
                'companies.website',
                'companies_selected.created_at as selected_date'
            )
            ->get()
            ->map(function ($item) {
                if (!$item || !isset($item->selected_date)) {
                    $item->selected_date = null;
                } else {
                    try {
                        $item->selected_date = date('Y-m-d', strtotime($item->selected_date));
                    } catch (\Exception $e) {
                        $item->selected_date = null;
                    }
                }
                return $item;
            });

        return response()->json($companies);
    } catch (\Exception $e) {
        // Log the error for debugging
        Log::error('Failed to fetch selected companies: ' . $e->getMessage(), [
            'candidate_id' => $candidate_id,
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json(['error' => 'An error occurred while fetching selected companies'], 500);
    }
}
    public function getSkillsData(Request $request, $companyId)
    {
        try {
            // Step 1: Fetch skills for the given company ID
            $skills = Skill::where('company_id', $companyId)->get();

            if ($skills->isEmpty()) {
                return response()->json(['message' => 'No skills found for this company'], 404);
            }

            $skillIds = $skills->pluck('id')->toArray();
            $skillNames = $skills->pluck('name')->toArray();

            // Step 2: Fetch prerequisites (Query 1) // prerequesties
            //there
            $prerequisites = Roadmap::join('prerequisites', 'roadmaps.skill_id', '=', 'prerequisites.skill_id')
                ->whereIn('roadmaps.skill_id', $skillIds)
                ->get(['roadmaps.*', 'prerequisites.*']);

            // Step 3: Fetch tools (Query 2)
            $tools = Tool::join('skills', 'tools.name', '=', 'skills.name')
                ->join('roadmaps', 'skills.id', '=', 'roadmaps.skill_id')
                ->whereIn('skills.id', $skillIds)
                ->get(['tools.*', 'skills.*', 'roadmaps.*']);

            // Step 4: Fetch candidate courses (Query 3)
            $candidateCourses = CandidateCourse::join('skills', function ($join) {
                    $join->whereRaw('candidate_courses.name LIKE CONCAT("%", skills.name, "%")')
                         ->orWhereRaw('skills.name LIKE CONCAT("%", candidate_courses.name, "%")');
                })
                ->join('roadmaps', 'skills.id', '=', 'roadmaps.skill_id')
                ->whereIn('skills.id', $skillIds)
                ->get(['candidate_courses.*', 'skills.*', 'roadmaps.*']);

            // Step 5: Fetch roadmap skills (Query 4)
            $roadmapSkills = SkillRoadmap::join('skills', function ($join) {
                    $join->whereRaw('roadmap_skills.text LIKE CONCAT("%", skills.name, "%")')
                         ->orWhereRaw('skills.name LIKE CONCAT("%", roadmap_skills.text, "%")');
                })
                ->join('roadmaps', 'skills.id', '=', 'roadmaps.skill_id')
                ->whereIn('skills.id', $skillIds)
                ->get(['roadmap_skills.*', 'skills.*', 'roadmaps.*']);

            // Step 6: Format the response
            $response = [
                'prerequisites' => $prerequisites->map(function ($item) {
                    return [
                        'roadmap' => collect($item)->only(Roadmap::getModel()->getFillable()),
                        'prerequisite' => collect($item)->only(Prerequiste::getModel()->getFillable()),
                    ];
                })->toArray(),
                'candidate_courses' => $candidateCourses->map(function ($item) {
                    return [
                        'course' => collect($item)->only(CandidateCourse::getModel()->getFillable()),
                        'skill' => collect($item)->only(Skill::getModel()->getFillable()),
                        'roadmap' => collect($item)->only(Roadmap::getModel()->getFillable()),
                    ];
                })->toArray(),
                'roadmap_skills' => $roadmapSkills->map(function ($item) {
                    return [
                        'roadmap_skill' => collect($item)->only(SkillRoadmap::getModel()->getFillable()),
                        'skill' => collect($item)->only(Skill::getModel()->getFillable()),
                        'roadmap' => collect($item)->only(Roadmap::getModel()->getFillable()),
                    ];
                })->toArray(),
                'tools' => $tools->map(function ($item) {
                    return [
                        'tool' => collect($item)->only(Tool::getModel()->getFillable()),
                        'skill' => collect($item)->only(Skill::getModel()->getFillable()),
                        'roadmap' => collect($item)->only(Roadmap::getModel()->getFillable()),
                    ];
                })->toArray(),
            ];

            return response()->json($response, 200);
        } catch (\Exception $e) {
            // Log::error('Error fetching skills data: ' . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
}
//testetestestest

