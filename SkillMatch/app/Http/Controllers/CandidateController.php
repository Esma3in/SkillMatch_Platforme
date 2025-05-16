<?php

namespace App\Http\Controllers;

use Mpdf\Mpdf;
use App\Models\Skill;
use App\Models\Company;
use App\Models\Candidate;
use App\Models\Experience;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\ProfileCandidate;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use NunoMaduro\Collision\Adapters\Phpunit\State;

class CandidateController extends Controller
{

    public function getCandidate($id){
        $candidate = Candidate::with(['profile','languages','skills','badges'])->find($id);

        if($candidate){
            return response()->json($candidate,200);
        }else{
            return response()->json(['message'=>'Candidate Not Found'],404);
        }
    }


    public function CompaniesMatched($id)
    {
        $candidate = Candidate::with(['skills'])->findOrFail($id);
        Log::info($candidate);
        $candidateSkillIds = $candidate->skills->pluck('id')->toArray();
        Log::info($candidateSkillIds);
        $companies = Company::with(['skills', 'profile'])->get();
        Log::info($companies);
        $companiesSuggested = [];

        foreach ($companies as $company) {
            $companySkillIds = $company->skills->pluck('id')->toArray();
            Log::info($companySkillIds);
            if (count(array_intersect($candidateSkillIds, $companySkillIds)) > 0) {
                $companiesSuggested[] = $company;
            }
        }

        return response()->json($companiesSuggested, 200);
    }



    public function Logout()
    {
        session()->forget('candidate_id'); // Remove the candidate ID from session
        session()->invalidate(); // Invalidate the session
        session()->regenerateToken(); // Regenerate the CSRF token for security

        return response()->json(['message' => 'Successfully logged out'], 200);
    }




    // profile candidate
    public function storeProfile(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'field' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^\+?[0-9\s\-]{6,20}$/',
            'file' => 'required|file|mimes:pdf,doc,docx|max:2048', // Max 2MB
            'projects' => 'required|string',
            'location' => 'required|string|max:255',
            'photoProfile' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'candidate_id'=>'required'
        ]);

        // Handle file uploads
        $photoPath = $request->file('photoProfile')->store('images', 'public');
        $filePath = $request->file('file')->store('files', 'public');

        // Create a new CandidateProfile record
        $profile = ProfileCandidate::create([

            'field' => $validated['field'],
            'last_name' => $validated['lastName'],
            'phoneNumber' => $validated['phone'],
            'file' => $filePath,
            'projects' => $validated['projects'],
            'localisation' => $validated['location'],
            'photoProfil' => $photoPath,
            'candidate_id'=>$validated['candidate_id']
        ]);

        // Return a success response
        return response()->json([
            'message' => 'Profile created successfully!',
            'data' => $profile,
        ], 201);
    }


    public function storeExperience(Request $request)
    {
        // Define validation rules for experience and profile fields
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'experience' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'employement_type' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'startDate' => 'required|date_format:d/m/Y',
            'endDate' => 'nullable|date_format:d/m/Y|after_or_equal:startDate',
            'description' => 'nullable|string|max:1000',
            // Profile fields (optional except location)
            'field' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^\+?[0-9\s\-]{6,20}$/',
            'file' => 'required|file|mimes:pdf,doc,docx|max:2048', // Max 2MB
            'projects' => 'required|string',
            'photoProfile' => 'required|image|mimes:jpeg,png,jpg|max:2048',

        ]);

        try {
            // Run profile and experience creation in a transaction
            $experience = DB::transaction(function () use ($validated, $request) {
                // Check if profile exists for candidate
                $profile = ProfileCandidate::where('candidate_id', $validated['candidate_id'])->first();

                // Create profile if it doesn't exist
                if (!$profile) {
                    $profile = ProfileCandidate::create([
                        'field' => $validated['field'],
                        'last_name' => $validated['lastName'],
                        'phoneNumber' => $validated['phone'],
                        'file' => $validated['file'],
                        'projects' => $validated['projects'],
                        'localisation' => $validated['location'],
                        'photoProfil' =>$validated['photoProfile'],
                        'candidate_id'=>$validated['candidate_id']
                    ]);
                } else {
                    // Update location if profile exists (optional)
                    $profile->update(['location' => $validated['location']]);
                }

                // Create experience record
                return Experience::create([
                    'candidate_profile_id' => $profile->id,
                    'experience' => $validated['experience'],
                    'location' => $validated['location'],
                    'employement_type' => $validated['employement_type'],
                    'role' => $validated['role'],
                    'start_date' => $validated['startDate'],
                    'end_date' => $validated['endDate'] ?? null,
                    'description' => $validated['description'] ?? null,
                ]);
            });

            // Return success response
            return response()->json([
                'message' => 'Experience and profile created successfully',
                'data' => $experience,
            ], 201);
        } catch (\Exception $e) {
            // Log error and return failure response
            Log::error('Error storing experience and profile: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create experience and profile',
            ], 500);
        }
    }

    public function GetProfile($id){
        $candidate = Candidate::with(['profile','languages'])->find($id);

        return response()->json($candidate,200);
    }


    public function printCV($id)
    {
        ini_set('memory_limit', '256M');


        $candidate = Candidate::with(['profile', 'languages'])->find($id);


        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        $mpdf = new \Mpdf\Mpdf();

        $html = '
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Candidate CV</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f3f4f6;
                    color: #333;
                }
                .container {
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 2px solid #ddd;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }
                .header .info {
                    flex: 1;
                }
                .header img {
                    border-radius: 50%;
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 5px;
                }
                h2 {
                    font-size: 20px;
                    margin-bottom: 10px;
                }
                .contact-info p, .bio p {
                    margin: 5px 0;
                }
                .languages ul {
                    padding-left: 20px;
                }
                .languages li {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="info">
                        <h1>' . $candidate->name . ' ' . $candidate->profile->last_name . '</h1>
                        <h2>' . $candidate->profile->field . '</h2>
                    </div>';

        if ($candidate->profile->photoProfil) {
            $html .= '<img src="' . storage_path('/app/public/' . $candidate->profile->photoProfil) . '" alt="Profile Photo">';
        }

        $html .= '</div>
                <div class="contact-info">
                    <h2>Contact Information</h2>
                    <p><strong>Email:</strong> ' . $candidate->email . '</p>
                    <p><strong>Phone:</strong> ' . $candidate->profile->phoneNumber . '</p>
                    <p><strong>Location:</strong> ' . $candidate->profile->localisation . '</p>
                </div>

                <div class="languages">
                    <h2>Languages</h2>
                    <ul>';

        foreach ($candidate->languages as $language) {
            $html .= '<li>'. $language->language . ' - <span>' . $language->level . '</span></li>';
        }

        $html .= '</ul>
                </div>

                <div class="bio">
                    <h2>Bio</h2>
                    <p>' . nl2br(e($candidate->profile->description)) . '</p>
                </div>
            </div>
        </body>
        </html>';


        $mpdf->WriteHTML($html);
        return response($mpdf->Output('Candidate_info' . $id, 'I'))
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="candidate_cv.pdf"');

    }
    public function AllCandidates(){
        $candidates = Candidate::with('profile')
            ->whereIn('state', ['active', 'unactive','waiting'])
            ->get();
        return response()->json($candidates, 200);
    }

    public function setstate(Request $request){
        $request->validate([
            'id'=>'required',
            'state' => 'required|in:unactive,active,banned'
        ]);
        $candidate = Candidate::where('id', $request->id)->first();
        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }
        $candidate->update([
            'state' => $request->state
        ]);
        return response()->json(['message' => 'Candidate state updated successfully'], 200);
    }

     public function show($id)
    {
        // Find the candidate by ID
        $candidate = Candidate::find($id);

        // Check if the candidate exists
        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        // Return the state of the candidate
        return response()->json(['state' => $candidate->state], 200);
    }





    // Filter candidates for company
    /**
     * Filter candidates based on various criteria
     */
    public function filterCandidates(Request $request)
    {
        $city = $request->input('city');
        $skill = $request->input('skill');
        $field = $request->input('field');

        $candidates = Candidate::with(['profile', 'skills', 'badges', 'attestations'])
            ->whereHas('profile', function ($query) use ($city, $field) {
                if ($city) {
                    $query->where('localisation', 'like', "%$city%");
                }

                if ($field) {
                    $query->where('field', 'like', "%$field%");
                }
            })
            ->when($skill, function ($query) use ($skill) {
                $query->whereHas('skills', function ($q) use ($skill) {
                    $q->where('name', 'like', "%$skill%");
                });
            })
            ->paginate(5); // 5 candidats par page

        return response()->json($candidates);
    }


    /**
     * Get details for a specific candidate.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCandidateDetails($id)
    {
        try {
            $candidate = Candidate::with(['profile', 'skills', 'badges', 'attestations', 'tests'])
                ->findOrFail($id);

            $avgScore = $candidate->tests->avg('pivot.score') ?? 0;
            $certified = $candidate->attestations->count() > 0;

            $formattedCandidate = [
                'id' => $candidate->id,
                'name' => $candidate->name,
                'field' => optional($candidate->profile)->field,
                'location' => optional($candidate->profile)->localisation,
                'testScore' => round($avgScore),
                'certified' => $certified,
                'skills' => $candidate->skills->pluck('name')->toArray(),
                'description' => optional($candidate->profile)->description,
                'badges' => $candidate->badges->map(function ($badge) {
                    return [
                        'name' => $badge->name,
                        'icon' => $badge->icon,
                    ];
                })->toArray(),
                'resumeUrl' => optional($candidate->profile)->file,
            ];

            return response()->json([
                'data' => $formattedCandidate
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Candidate not found.',
                'message' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching candidate details: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'An error occurred while fetching candidate details.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all available skills.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSkills(Request $request)
    {
        try {
            $skills = Skill::select('name')->distinct()->pluck('name')->toArray();
            return response()->json($skills);
        } catch (\Exception $e) {
            Log::error('Error fetching skills: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to fetch skills.',
                'message' => $e->getMessage()
            ], 500);
        }
    }




    //Notifications
    public function getNotifications($candidate_id)
    {
        try {
            // Validate candidate_id
            if (!is_numeric($candidate_id) || $candidate_id <= 0) {
                return response()->json([
                    'error' => 'Invalid candidate ID'
                ], 400);
            }

            // Fetch notifications
            $notifications = Notification::where('candidate_id', $candidate_id)->get();

            // Check if notifications exist
            if ($notifications->isEmpty()) {
                return response()->json([
                    'message' => 'No notifications found',
                    'data' => []
                ], 200);
            }

            return response()->json([
                'message' => 'Notifications retrieved successfully',
                'data' => $notifications
            ], 200);

        } catch (\Exception $e) {
            // Handle any unexpected errors
            return response()->json([
                'error' => 'An error occurred while fetching notifications',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
