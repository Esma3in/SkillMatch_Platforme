<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Formation;
use Illuminate\Http\Request;
use App\Models\ProfileCandidate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProfileCandidateController extends Controller
{
    public function EditDescription(Request $request)
    {
        $credentials = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'description' => 'required|min:10',
        ]);

        ProfileCandidate::where('candidate_id', $credentials['candidate_id'])->update([
            'description' => $credentials['description']
        ]);

        return response()->json(['message' => 'Description updated successfully.'], 200);
    }
    public function storeProfile(Request $request)
    {

        $validated = $request->validate([
            'field' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^\+?[0-9\s\-]{6,20}$/',
            'file' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'projects' => 'required|string',
            'location' => 'required|string|max:255',
            'photoProfile' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'candidate_id' => 'required'
        ]);

        $photoPath = $request->file('photoProfile')->store('images', 'public');
        $filePath = $request->file('file')->store('files', 'public');

        $profile = ProfileCandidate::create([

            'field' => $validated['field'],
            'last_name' => $validated['lastName'],
            'phoneNumber' => $validated['phone'],
            'file' => $filePath,
            'projects' => $validated['projects'],
            'localisation' => $validated['location'],
            'photoProfil' => $photoPath,
            'candidate_id' => $validated['candidate_id']
        ]);

        return response()->json([
            'message' => 'Profile created successfully!',
            'data' => $profile,
        ], 201);
    }
    public function storeEducation(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'required|string|max:255',
            'institution_name' => 'required|string|max:255',
            'start_date' => 'required|date_format:d/m/Y',
            'end_date' => 'nullable|date_format:d/m/Y',
            'grade' => 'required|string|max:50',
            'description' => 'nullable|string|max:1000',
        ]);

        try {
            // Run in a transaction to ensure data integrity
            $education = DB::transaction(function () use ($validated, $request) {
                // Get the profile for the candidate
                $profile = ProfileCandidate::where('candidate_id', $validated['candidate_id'])->first();

                if (!$profile) {
                    throw new \Exception('Profile not found for this candidate');
                }

                // Handle custom fields for "Other" options
                $degree = $validated['degree'];
                $fieldOfStudy = $validated['field_of_study'];
                $institution = $validated['institution'];

                if ($degree === 'Other' && $request->has('customDegree')) {
                    $degree = $request->input('customDegree');
                }
                if ($fieldOfStudy === 'Other' && $request->has('customFieldOfStudy')) {
                    $fieldOfStudy = $request->input('customFieldOfStudy');
                }
                if ($institution === 'Other' && $request->has('customInstitution')) {
                    $institution = $request->input('customInstitution');
                }

                // Format dates for database storage (convert from DD/MM/YYYY to YYYY-MM-DD)
                $startDate = \DateTime::createFromFormat('d/m/Y', $validated['start_date']);
                $startDateFormatted = $startDate ? $startDate->format('Y-m-d') : null;

                $endDateFormatted = null;
                if (!empty($validated['end_date'])) {
                    $endDate = \DateTime::createFromFormat('d/m/Y', $validated['end_date']);
                    $endDateFormatted = $endDate ? $endDate->format('Y-m-d') : null;
                }

                // Create education record
                return Formation::create([
                    'candidate_profile_id' => $profile->id,
                    'degree' => $degree,
                    'field_of_study' => $fieldOfStudy,
                    'institution' => $institution,
                    'start_date' => $startDateFormatted,
                    'end_date' => $endDateFormatted,
                    'grade' => $validated['grade'],
                    'description' => $validated['description'] ?? null,
                ]);
            });

            // Return success response
            return response()->json([
                'message' => 'Education created successfully',
                'data' => $education,
            ], 201);
        } catch (\Exception $e) {
            // Log error and return failure response
            Log::error('Error storing education: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create education: ' . $e->getMessage(),
            ], 500);
        }
    }

}
