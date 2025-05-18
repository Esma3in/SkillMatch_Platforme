<?php

namespace App\Http\Controllers;

use App\Models\Roadmap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoadmapController extends Controller
{
    public function getCompleteRoadmap($roadmap_id)
    {
        // Vérifier l'existence de la roadmap
        $roadmap = DB::table('roadmaps')->where('id', $roadmap_id)->first();
        if (!$roadmap) {
            return response()->json(['error' => 'Roadmap not found'], 404);
        }

        // Prérequis liés à la roadmap via skill_id
        $prerequisites = DB::table('prerequisites')
            ->join('skills', 'prerequisites.skill_id', '=', 'skills.id')
            ->join('roadmaps', 'skills.id', '=', 'roadmaps.skill_id')
            ->where('roadmaps.id', $roadmap_id)
            ->select('prerequisites.*')
            ->get();

        // Outils liés à la roadmap via skill name
        $tools = DB::table('tools')
            ->join('skills', 'tools.name', '=', 'skills.name')
            ->join('roadmaps', 'skills.id', '=', 'roadmaps.skill_id')
            ->where('roadmaps.id', $roadmap_id)
            ->select('tools.*')
            ->get();

        // Cours liés à la roadmap via nom partiel
        $courses = DB::table('candidate_courses')
            ->join('skills', function ($join) {
                $join->on(DB::raw('candidate_courses.name'), 'like', DB::raw("CONCAT('%', skills.name, '%')"))
                    ->orOn(DB::raw('skills.name'), 'like', DB::raw("CONCAT('%', candidate_courses.name, '%')"));
            })
            ->join('roadmaps', 'skills.id', '=', 'roadmaps.skill_id')
            ->where('roadmaps.id', $roadmap_id)
            ->select('candidate_courses.*')
            ->get();

        // Compétences liées à la roadmap via contenu textuel
        $roadmapSkills = DB::table('roadmap_skills')
            ->join('skills', function ($join) {
                $join->on(DB::raw('roadmap_skills.text'), 'like', DB::raw("CONCAT('%', skills.name, '%')"))
                    ->orOn(DB::raw('skills.name'), 'like', DB::raw("CONCAT('%', roadmap_skills.text, '%')"));
            })
            ->join('roadmaps', 'skills.id', '=', 'roadmaps.skill_id')
            ->where('roadmaps.id', $roadmap_id)
            ->select('roadmap_skills.*')
            ->get();

        // Retour du tout en une seule réponse JSON
        return response()->json([
            'roadmap' => $roadmap,
            'prerequisites' => $prerequisites,
            'tools' => $tools,
            'candidate_courses' => $courses,
            'roadmap_skills' => $roadmapSkills,
        ]);
    
    }
    public function generateRoadmap(Request $request){
        $validated = $request->validate([
             'name'=>'nullable|string|max:120',
            'skill_id' =>'required|integer|exists:skills,id',
            'completed'=>'required|string',
            'candidate_id'=>'required|integer|exists:candidates,id'
        ]);
        $roadmap = Roadmap::create([
            'name'=>$validated['name'],
            'skill_id'=>$validated['skill_id'],
            'completed'=>$validated['completed'],
            'candidate_id'=>$validated['candidate_id']
        ]);
        return response()->json([
            'message' => 'Company selected successfully',
            'data' => $roadmap
        ], 201);
    }
    public function details($id)
    {
        try {
            // Fetch the roadmap by ID
            $roadmap = Roadmap::find($id);
    
            // Check if roadmap exists
            if (!$roadmap) {
                return response()->json([
                    'message' => 'Roadmap not found'
                    
                ], 404);
            }
    
            // Return the roadmap details
            return response()->json([
                'id' => $roadmap->id,
                'name' => $roadmap->name,
                'completed' => $roadmap->completed
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching roadmap details',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getcompanyInfoForRoadmapId($roadmap_id){
            $result = DB::table('companies')
                ->join('companies_selecteds', 'companies.id', '=', 'companies_selecteds.company_id')
                ->join('roadmaps', 'companies_selecteds.candidate_id', '=', 'roadmaps.candidate_id')
                ->where('roadmaps.id', $roadmap_id)
                ->select(
                    'companies.id as company_id',
                    'companies.name as company_name',

                    'companies_selecteds.candidate_id',
                    'roadmaps.id as roadmap_id',
                    'roadmaps.completed',
                    'roadmaps.created_at as roadmap_created_at'
                )
                ->first();
        
            if (!$result) {
                return response()->json(['message' => 'No matching record found'], 404);
            }
        
            // Return as a clearly structured associative array
            return response()->json([
                'company' => [
                    'id' => $result->company_id,
                    'name' => $result->company_name,
                ],
                'candidate' => [
                    'id' => $result->candidate_id,
                ],
                'roadmap' => [
                    'id' => $result->roadmap_id,
                    'completed' => $result->completed,
                    'created_at' => $result->roadmap_created_at,
                ],
            ]);
        }
        
}