<?php

namespace App\Http\Controllers;

use App\Models\Test;

use App\Models\Badge;
use App\Models\Result;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification; // Added Notification model

class AllCandidateController extends Controller
{
    /**
     * Display a listing of the candidates with their tests and badges.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $candidates = Candidate::with(['badges'])
            ->select('candidates.*')
            ->get()
            ->map(function ($candidate) {
                // Utiliser la table results avec le nom en minuscules
                $testStatus = DB::table('results')
                    ->where('candidate_id', $candidate->id)
                    ->select('test_id', 'score as status', 'created_at')
                    ->orderBy('created_at', 'desc')
                    ->get();

                $completedTests = $testStatus->count();

                $badgeCount = $candidate->badges->count();

                // Déterminer le statut du dernier test
                $lastTestStatus = 'No Tests';
                if ($testStatus->first()) {
                    $score = $testStatus->first()->status;
                    if ($score > 50) {
                        $lastTestStatus = 'Done';
                    } elseif ($score > 0) {
                        $lastTestStatus = 'In Progress';
                    } else {
                        $lastTestStatus = 'Failed';
                    }
                }

                return [
                    'id' => $candidate->id,
                    'rank' => '#' . (3057 + $candidate->id - 1),
                    'name' => $candidate->name,
                    'email' => $candidate->email,
                    'badges' => $badgeCount,
                    'completedTests' => $completedTests,
                    'tests' => $testStatus,
                    'initials' => $this->getInitials($candidate->name),
                    'lastTestDate' => $testStatus->first() ? $testStatus->first()->created_at : null,
                    'lastTestStatus' => $lastTestStatus
                ];
            });

        $topRankedCandidates = $candidates->sortBy('rank')->values();

        return response()->json([
            'candidates' => $candidates,
            'topRankedCandidates' => $topRankedCandidates
        ]);
    }

    /**
     * Get candidate details including tests and badges
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Fetch the candidate with related data
        $candidate = Candidate::with(['profile', 'badges', 'tests'])
            ->where('id', $id)
            ->first();

        if (!$candidate) {
            return response()->json(['message' => 'Candidat non trouvé'], 404);
        }

        // Structure the response
        return response()->json([
            'candidate' => [
                'id' => $candidate->id,
                'name' => $candidate->name,
                'email' => $candidate->email,
                'state' => $candidate->state,
                'profile' => $candidate->profile ? [
                    'last_name' => $candidate->profile->last_name,
                    'field' => $candidate->profile->field,
                    'phoneNumber' => $candidate->profile->phoneNumber,
                    'description' => $candidate->profile->description,
                    'photoProfil' => $candidate->profile->photoProfil,
                    'localisation' => $candidate->profile->localisation,
                    'experience' => $candidate->profile->experience,
                    'projects' => $candidate->profile->projects,
                    'formation' => $candidate->profile->formation,
                    'competenceList' => $candidate->profile->competenceList,
                ] : null,
                'badges' => $candidate->badges->map(function ($badge) {
                    return [
                        'id' => $badge->id,
                        'name' => $badge->name,
                        'iconcontrôle' => $badge->icon,
                        'description' => $badge->description,
                        'date_obtained' => $badge->Date_obtained->toDateString(),
                    ];
                })->toArray(),
                'tests' => $candidate->tests->map(function ($test) {
                    return [
                        'id' => $test->id,
                        'name' => $test->name,
                        'score' => $test->score,
                        'date' => $test->created_at->toDateString(),
                    ];
                })
            ]
        ]);
    }



    /**
     * Accept a candidate and create a notification
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function accept($id)
    {
        // Find the candidate
        $candidate = Candidate::find($id);

        if (!$candidate) {
            return response()->json(['message' => 'Candidate not found'], 404);
        }

        // Update candidate status (adjust according to your logic)
        $candidate->state = 'accepted'; // Make sure the 'status' column exists
        $candidate->save();

        // Create a notification
        Notification::create([
            'message' => 'You have been accepted by our company. Congratulations!',
            'dateEnvoi' => now(),
            'destinataire' => $candidate->email, // or any field identifying the candidate
            'candidate_id' => $candidate->id,
            'company_id' => $candidate->company_id ?? 1,
        ]);

        return response()->json(['message' => 'Candidate accepted and notification sent successfully']);
    }


    /**
     * Reject a candidate and create a notification
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function reject($id)
    {
        // Find the candidate
        $candidate = Candidate::find($id);

        if (!$candidate) {
            return response()->json(['message' => 'Candidate not found'], 404);
        }

        // Update candidate status
        $candidate->state = 'rejected'; // Make sure 'state' column exists
        $candidate->save();

        // Create a rejection notification
        Notification::create([
            'message' => 'Your have been rejected by our company. Feel free to apply to other companies. Good luck!',
            'dateEnvoi' => now(),
            'destinataire' => $candidate->email,
            'candidate_id' => $candidate->id,
            'company_id' => $candidate->company_id ?? 1,
        ]);

        return response()->json(['message' => 'Candidate rejected and notification sent successfully']);
    }



    /**
     * Get initials from a name
     *
     * @param string $name
     * @return string
     */
    private function getInitials($name)
    {
        $nameParts = explode(' ', $name);
        $initials = '';

        if (count($nameParts) >= 2) {
            $initials = strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[1], 0, 1));
        } else {
            $initials = strtoupper(substr($name, 0, 2));
        }

        return $initials;
    }
}
