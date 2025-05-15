<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SkillController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'name' => 'required|string|max:255',
            'level' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'usageFrequency' => 'required|string|max:255',
            'classement' => 'required|string|max:255',
            'test_id' => 'nullable|exists:Tests,id', // Optional, matches nullable foreign key
        ]);

        try {
            // Run in a transaction to ensure data integrity
            $skill = DB::transaction(function () use ($validated) {
                // Find or create the skill
                $skill = Skill::firstOrCreate(
                    ['name' => $validated['name']], // Match on name to avoid duplicates
                    [
                        'level' => $validated['level'],
                        'type' => $validated['type'],
                        'usageFrequency' => $validated['usageFrequency'],
                        'classement' => $validated['classement'],
                        'test_id' => $validated['test_id'] ?? null, // Nullable test_id
                    ]
                );

                // Find the candidate
                $candidate = Candidate::findOrFail($validated['candidate_id']);

                // Attach the skill to the candidate in the pivot table (avoid duplicates)
                if (!$candidate->skills()->where('skill_id', $skill->id)->exists()) {
                    $candidate->skills()->attach($skill->id);
                }

                return $skill;
            });

            // Return success response
            return response()->json([
                'message' => 'Skill added successfully',
                'data' => $skill,
            ], 201);
        } catch (\Exception $e) {
            // Log error and return failure response
            Log::error('Error storing skill: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to add skill: ' . $e->getMessage(),
            ], 500);
        }
    }

    // skills by candidate 
    public function getSkillsByCandidate($candidateId)
    {
        try {
            // Find the candidate
            $candidate = Candidate::find($candidateId);

            if (!$candidate) {
                return response()->json(['error' => 'Candidate not found'], 404);
            }

            // Get all skills for this candidate
            $skills = $candidate->skills()->get();

            return response()->json($skills, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching skills: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch skills'], 500);
        }
    }
    public function allSkills(){
        $skills= Skill::all();
        return response()->json($skills);
    }
}