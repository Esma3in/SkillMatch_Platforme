<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use App\Models\ProfileCandidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExperienceController extends Controller
{
    /**
     * Store a newly created experience in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'experience' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'company' => 'required|string|max:255', // This will be mapped to employement_type
            'role' => 'required|string|max:255',
            'startDate' => 'required|date_format:d/m/Y',
            'endDate' => 'nullable|date_format:d/m/Y',
            'description' => 'nullable|string|max:1000',
        ]);

        try {
            // Run in a transaction to ensure data integrity
            $experience = DB::transaction(function () use ($validated, $request) {
                // Get the profile for the candidate
                $profile = ProfileCandidate::where('candidate_id', $validated['candidate_id'])->first();
                
                if (!$profile) {
                    throw new \Exception('Profile not found for this candidate');
                }

                // Format dates for database storage (convert from DD/MM/YYYY to YYYY-MM-DD)
                $startDate = \DateTime::createFromFormat('d/m/Y', $validated['startDate']);
                $startDateFormatted = $startDate ? $startDate->format('Y-m-d') : null;
                
                $endDateFormatted = null;
                if (!empty($validated['endDate'])) {
                    $endDate = \DateTime::createFromFormat('d/m/Y', $validated['endDate']);
                    $endDateFormatted = $endDate ? $endDate->format('Y-m-d') : null;
                }

                // Create experience record
                return Experience::create([
                    'candidate_profile_id' => $profile->id,
                    'experience' => $validated['experience'],
                    'location' => $validated['location'],
                    'employement_type' => $validated['company'], // Map company to employement_type
                    'role' => $validated['role'],
                    'start_date' => $startDateFormatted,
                    'end_date' => $endDateFormatted,
                    'description' => $validated['description'] ?? null,
                ]);
            });

            // Return success response
            return response()->json([
                'message' => 'Experience created successfully',
                'data' => $experience,
            ], 201);
        } catch (\Exception $e) {
            // Log error and return failure response
            Log::error('Error storing experience: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create experience: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all experiences for a candidate.
     *
     * @param  int  $candidateId
     * @return \Illuminate\Http\Response
     */
    public function getExperiencesByCandidate($candidateId)
    {
        try {
            // Get the profile for the candidate
            $profile = ProfileCandidate::where('candidate_id', $candidateId)->first();
            
            if (!$profile) {
                return response()->json(['error' => 'Profile not found for this candidate'], 404);
            }

            // Get all experiences for this profile
            $experiences = Experience::where('candidate_profile_id', $profile->id)->get();

            return response()->json($experiences, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching experiences: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch experiences'], 500);
        }
    }
}