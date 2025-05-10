<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Test;
use App\Models\Badge;
use App\Models\Notification; // Added Notification model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
                // Utiliser la table Results avec le bon nom
                $testStatus = DB::table('Results')  // Notez le R majuscule
                    ->where('candidate_id', $candidate->id)
                    ->select('test_id', 'score as status', 'created_at')  // Utilisez 'score' au lieu de 'result'
                    ->orderBy('created_at', 'desc')
                    ->get();

                // Modifiez également cette ligne si nécessaire
                $completedTests = $testStatus->count(); // ou une autre logique adaptée à votre modèle

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

        // Retourner les données au format JSON pour l'API
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
        $candidate = Candidate::with(['badges', 'skills', 'profile'])
            ->findOrFail($id);

        $testResults = DB::table('Results')  // Notez le R majuscule
            ->where('candidate_id', $candidate->id)
            ->join('tests', 'Results.test_id', '=', 'tests.id')
            ->select('tests.*', 'Results.score as status', 'Results.created_at as test_date')
            ->get();

        return response()->json([
            'candidate' => $candidate,
            'testResults' => $testResults,
            'badges' => $candidate->badges
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
        $candidate = Candidate::findOrFail($id);
        $candidate->state = 'accepted';
        $candidate->save();

        // Create a notification for the candidate
        Notification::create([
            'candidate_id' => $candidate->id,
            'message' => 'You’re qualified to join us — congratulations!',
            'type' => 'acceptance',
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'Candidate accepted successfully']);
    }

    /**
     * Reject a candidate and create a notification
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function reject($id)
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->state = 'rejected';
        $candidate->save();

        // Create a notification for the candidate
        Notification::create([
            'candidate_id' => $candidate->id,
            'message' => 'We wish you the best of luck in another company.',
            'type' => 'rejection',
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'Candidate rejected successfully']);
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
