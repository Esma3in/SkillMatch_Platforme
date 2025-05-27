<?php
namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Skill;
use App\Models\Problem;
use App\Models\Challenge;
use App\Models\Candidate;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ChallengeController extends Controller
{
    /**
     * Display a listing of the challenges.
     */
    public function index()
    {
        $challenges = Challenge::with('skill')
            ->withCount(['problems', 'candidates'])
            ->orderBy('created_at', 'desc')
        ->paginate(10);

        return response()->json($challenges);
    }

    /**
     * Display the specified challenge.
     */
    public function show(Challenge $challenge)
    {
        $challenge->load(['skill', 'problems' => function($query) {
            $query->with('skill');
        }]);

            return response()->json($challenge);
    }

    /**
     * Store a newly created challenge in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'level' => 'required|in:beginner,easy,medium,intermediate,hard,advanced,expert',
            'skill_id' => 'required|exists:skills,id',
            'problem_ids' => 'required|array',
            'problem_ids.*' => 'exists:problems,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the challenge
        $challenge = Challenge::create($request->only([
            'name', 'description', 'level', 'skill_id'
        ]));

        // Attach problems with order
        $problems = $request->input('problem_ids');
        $problemOrder = [];
        foreach ($problems as $index => $problemId) {
            $problemOrder[$problemId] = ['order' => $index];
        }
        $challenge->problems()->attach($problemOrder);

        // Return the challenge with problems
        $challenge->load(['skill', 'problems' => function($query) {
            $query->with('skill')->orderBy('challenge_problem.order');
        }]);

        return response()->json($challenge, 201);
    }

    /**
     * Update the specified challenge in storage.
     */
    public function update(Request $request, Challenge $challenge)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'level' => 'sometimes|required|in:beginner,easy,medium,intermediate,hard,advanced,expert',
            'skill_id' => 'sometimes|required|exists:skills,id',
            'problem_ids' => 'sometimes|required|array',
            'problem_ids.*' => 'exists:problems,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update the challenge
        $challenge->update($request->only([
            'name', 'description', 'level', 'skill_id'
        ]));

        // Update problems if provided
        if ($request->has('problem_ids')) {
            // Detach all problems
            $challenge->problems()->detach();

            // Attach new problems with order
            $problems = $request->input('problem_ids');
            $problemOrder = [];
            foreach ($problems as $index => $problemId) {
                $problemOrder[$problemId] = ['order' => $index];
            }
            $challenge->problems()->attach($problemOrder);
        }

        // Return the challenge with problems
        $challenge->load(['skill', 'problems' => function($query) {
            $query->with('skill')->orderBy('challenge_problem.order');
        }]);

        return response()->json($challenge);
    }

    /**
     * Remove the specified challenge from storage.
     */
    public function destroy(Challenge $challenge)
    {
        // Delete the challenge (cascade will handle relationships)
        $challenge->delete();

        return response()->json(null, 204);
    }

    /**
     * Get all problems for a challenge.
     */
    public function getProblems(Challenge $challenge)
    {
        $problems = $challenge->problems()
            ->with('skill')
            ->orderBy('challenge_problem.order')
                ->get();

        return response()->json($problems);
    }

    /**
     * Start a challenge for a candidate.
     */
    public function startChallenge(Request $request, Challenge $challenge)
    {
        $candidateId = $request->input('candidate_id');
        $candidate = Candidate::findOrFail($candidateId);

        // Check if already enrolled
        if ($challenge->candidates()->where('candidate_id', $candidateId)->exists()) {
            return response()->json([
                'message' => 'You are already enrolled in this challenge',
                'challenge' => $challenge->load('skill', 'problems')
            ]);
        }

        // Enroll the candidate
        $challenge->candidates()->attach($candidateId, [
            'completed_problems' => 0,
            'is_completed' => false
        ]);

        return response()->json([
            'message' => 'Challenge started successfully',
            'challenge' => $challenge->load('skill', 'problems')
        ]);
    }

    /**
     * Update challenge progress for a candidate.
     */
    public function updateProgress(Request $request, Challenge $challenge)
    {
        $validator = Validator::make($request->all(), [
            'candidate_id' => 'required|exists:candidates,id',
            'problem_id' => 'required|exists:problems,id',
            'completed' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $candidateId = $request->input('candidate_id');
        $problemId = $request->input('problem_id');
        $completed = $request->input('completed');

        // Check if the problem belongs to this challenge
        if (!$challenge->problems()->where('problems.id', $problemId)->exists()) {
            return response()->json(['message' => 'Problem does not belong to this challenge'], 400);
        }

        // Get the enrollment record
        $enrollment = $challenge->candidates()->where('candidate_id', $candidateId)->first();

        if (!$enrollment) {
            return response()->json(['message' => 'You are not enrolled in this challenge'], 404);
        }

        // Mark the problem as completed for the candidate if not already
        if ($completed && !$enrollment->problems()->where('problem_id', $problemId)->exists()) {
            $enrollment->problems()->attach($problemId, ['completed_at' => now()]);

            // Update completed problems count
            $completedProblems = $enrollment->problems()->count();
            $totalProblems = $challenge->problems()->count();

            // Update the pivot table
            $challenge->candidates()->updateExistingPivot($candidateId, [
                'completed_problems' => $completedProblems
            ]);

            // Check if all problems are completed
            if ($completedProblems >= $totalProblems) {
                $certificateId = $this->generateCertificateId($candidateId, $challenge->id);

                $challenge->candidates()->updateExistingPivot($candidateId, [
                    'is_completed' => true,
                    'completion_date' => now(),
                    'certificate_id' => $certificateId
                ]);

                return response()->json([
                    'message' => 'Congratulations! You have completed this challenge.',
                    'progress' => [
                        'completed' => $completedProblems,
                        'total' => $totalProblems,
                        'percentage' => ($totalProblems > 0) ? ($completedProblems / $totalProblems) * 100 : 0,
                    ],
                    'certificate_id' => $certificateId
                ]);
            }

            return response()->json([
                'message' => 'Progress updated',
                'progress' => [
                    'completed' => $completedProblems,
                    'total' => $totalProblems,
                    'percentage' => ($totalProblems > 0) ? ($completedProblems / $totalProblems) * 100 : 0,
                ]
            ]);
        }

        return response()->json([
            'message' => 'No change in progress',
            'progress' => [
                'completed' => $enrollment->pivot->completed_problems,
                'total' => $challenge->problems()->count(),
                'percentage' => ($challenge->problems()->count() > 0) ?
                    ($enrollment->pivot->completed_problems / $challenge->problems()->count()) * 100 : 0,
            ]
        ]);
    }

    /**
     * Get certificate for a completed challenge.
     */
    public function getCertificate(Request $request, $certificateId)
    {
        $enrollment = DB::table('candidate_challenge')
            ->where('certificate_id', $certificateId)
            ->first();

        if (!$enrollment) {
            return response()->json(['message' => 'Certificate not found'], 404);
        }

        $challenge = Challenge::findOrFail($enrollment->challenge_id);
        $candidate = Candidate::findOrFail($enrollment->candidate_id);

        return response()->json([
            'certificate_id' => $certificateId,
            'candidate_name' => $candidate->name,
            'challenge_name' => $challenge->name,
            'skill' => $challenge->skill->name,
            'completion_date' => Carbon::parse($enrollment->completion_date)->format('F d, Y'),
            'level' => $challenge->level
        ]);
    }

    /**
     * Get all certificates for a candidate.
     */
    public function getCandidateCertificates($candidateId)
    {
        $candidate = Candidate::findOrFail($candidateId);

        $certificates = $candidate->challenges()
            ->wherePivot('is_completed', true)
            ->wherePivot('certificate_id', '!=', null)
            ->with('skill')
            ->get()
            ->map(function($challenge) {
                return [
                    'certificate_id' => $challenge->pivot->certificate_id,
                    'challenge_name' => $challenge->name,
                    'skill' => $challenge->skill->name,
                    'completion_date' => Carbon::parse($challenge->pivot->completion_date)->format('F d, Y'),
                    'level' => $challenge->level
                ];
            });

        return response()->json($certificates);
    }

    /**
     * Get all active challenges for admin.
     */
    public function getAdminChallenges()
    {
        $challenges = Challenge::with('skill')
            ->withCount(['problems', 'candidates'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($challenges);
    }

    /**
     * Generate a unique certificate ID.
     */
    private function generateCertificateId($candidateId, $challengeId)
    {
        $prefix = 'CERT';
        $timestamp = time();
        $random = Str::random(4);

        return "{$prefix}-{$candidateId}-{$challengeId}-{$timestamp}-{$random}";
    }

    /**
     * Get enrollment status and progress for a candidate in a challenge.
     */
    public function getEnrollmentStatus(Challenge $challenge, $candidateId)
    {
        $candidate = Candidate::findOrFail($candidateId);

        // Check if the candidate is enrolled in this challenge
        $enrollment = $challenge->candidates()
            ->where('candidate_id', $candidateId)
            ->first();

        if (!$enrollment) {
            return response()->json([
                'is_enrolled' => false,
                'message' => 'Candidate is not enrolled in this challenge'
            ], 404);
        }

        // Get completed problems
        $completedProblems = DB::table('candidate_problem')
            ->where('candidate_id', $candidateId)
            ->where('challenge_id', $challenge->id)
            ->pluck('problem_id')
            ->toArray();

        // Calculate progress
        $totalProblems = $challenge->problems()->count();
        $completedCount = count($completedProblems);
        $percentage = ($totalProblems > 0) ? ($completedCount / $totalProblems) * 100 : 0;

        return response()->json([
            'is_enrolled' => true,
            'completed_problems' => $completedCount,
            'total_problems' => $totalProblems,
            'percentage' => $percentage,
            'completed_problems_ids' => $completedProblems,
            'is_completed' => $enrollment->pivot->is_completed,
            'completion_date' => $enrollment->pivot->completion_date,
            'certificate_id' => $enrollment->pivot->certificate_id
        ]);
    }
}
