<?php
namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Skill;
use App\Models\Problem;
use App\Models\Challenge;
use App\Models\Candidate;
use App\Models\LeetcodeProblem;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        // Log incoming request data for debugging
        Log::info('Challenge store request data:', $request->all());

        // Ensure problem_ids is an array of integers
        $problemIds = collect($request->input('problem_ids', []))
            ->map(function ($id) {
                return is_numeric($id) ? (int) $id : $id;
            })
            ->toArray();

        // Replace the request problem_ids with our sanitized version
        $request->merge(['problem_ids' => $problemIds]);

        // Log sanitized problem IDs
        Log::info('Sanitized problem IDs:', $problemIds);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'level' => 'required|in:beginner,easy,medium,intermediate,hard,advanced,expert',
            'skill_id' => 'required|exists:skills,id',
            'problem_ids' => 'required|array|min:1',
            'problem_ids.*' => 'integer',
        ]);

        if ($validator->fails()) {
            Log::error('Challenge validation failed:', $validator->errors()->toArray());

            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Separate LeetCode problems from standard problems
        $standardProblemIds = Problem::whereIn('id', $problemIds)->pluck('id')->toArray();
        $leetcodeProblemIds = LeetcodeProblem::whereIn('id', $problemIds)->pluck('id')->toArray();

        // Check if all requested problems exist in either table
        $totalFoundProblems = count($standardProblemIds) + count($leetcodeProblemIds);

        Log::info("Problem validation counts:", [
            'standard_problems' => count($standardProblemIds),
            'leetcode_problems' => count($leetcodeProblemIds),
            'total_found' => $totalFoundProblems,
            'requested' => count($problemIds)
        ]);

        if ($totalFoundProblems !== count($problemIds)) {
            // Find which IDs are invalid
            $foundIds = array_merge($standardProblemIds, $leetcodeProblemIds);
            $missingIds = array_diff($problemIds, $foundIds);

            Log::error('Some problems do not exist in either table:', [
                'submitted' => $problemIds,
                'found_in_problems' => $standardProblemIds,
                'found_in_leetcode' => $leetcodeProblemIds,
                'missing' => $missingIds
            ]);

            return response()->json([
                'errors' => [
                    'problem_ids' => ["The following problem IDs don't exist in our database: " . implode(', ', $missingIds)]
                ]
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create the challenge
            $challenge = Challenge::create($request->only([
                'name', 'description', 'level', 'skill_id'
            ]));

            // Handle standard problems
            if (!empty($standardProblemIds)) {
                // Attach standard problems with order
                $problemOrder = [];
                foreach ($standardProblemIds as $index => $problemId) {
                    $problemOrder[$problemId] = ['order' => $index];
                }
                $challenge->problems()->attach($problemOrder);
            }

            // Handle LeetCode problems
            if (!empty($leetcodeProblemIds)) {
                // Update challenge_id for LeetCode problems
                LeetcodeProblem::whereIn('id', $leetcodeProblemIds)
                    ->update(['challenge_id' => $challenge->id]);
            }

            DB::commit();

            // Return the challenge with problems
            $challenge->load(['skill', 'problems' => function($query) {
                $query->with('skill')->orderBy('challenge_problem.order');
            }, 'leetcodeProblems']);

            return response()->json($challenge, 201);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error creating challenge: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'data' => $request->all(),
                'exception_type' => get_class($e)
            ]);

            return response()->json([
                'message' => 'Failed to create challenge',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified challenge in storage.
     */
    public function update(Request $request, Challenge $challenge)
    {
        // Log incoming request data for debugging
        Log::info('Challenge update request data:', [
            'challenge_id' => $challenge->id,
            'data' => $request->all()
        ]);

        // Ensure problem_ids is an array of integers if provided
        if ($request->has('problem_ids')) {
            $problemIds = collect($request->input('problem_ids', []))
                ->map(function ($id) {
                    return is_numeric($id) ? (int) $id : $id;
                })
                ->toArray();

            // Replace the request problem_ids with our sanitized version
            $request->merge(['problem_ids' => $problemIds]);

            // Log sanitized problem IDs
            Log::info('Update - Sanitized problem IDs:', $problemIds);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'level' => 'sometimes|required|in:beginner,easy,medium,intermediate,hard,advanced,expert',
            'skill_id' => 'sometimes|required|exists:skills,id',
            'problem_ids' => 'sometimes|required|array|min:1',
            'problem_ids.*' => 'integer',
        ]);

        if ($validator->fails()) {
            Log::error('Challenge update validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if all problem IDs exist if problem_ids is provided
        if ($request->has('problem_ids')) {
            $problemIds = $request->input('problem_ids');

            // Separate LeetCode problems from standard problems
            $standardProblemIds = Problem::whereIn('id', $problemIds)->pluck('id')->toArray();
            $leetcodeProblemIds = LeetcodeProblem::whereIn('id', $problemIds)->pluck('id')->toArray();

            // Check if all requested problems exist in either table
            $totalFoundProblems = count($standardProblemIds) + count($leetcodeProblemIds);

            Log::info("Update - Problem validation counts:", [
                'standard_problems' => count($standardProblemIds),
                'leetcode_problems' => count($leetcodeProblemIds),
                'total_found' => $totalFoundProblems,
                'requested' => count($problemIds)
            ]);

            if ($totalFoundProblems !== count($problemIds)) {
                // Find which IDs are invalid
                $foundIds = array_merge($standardProblemIds, $leetcodeProblemIds);
                $missingIds = array_diff($problemIds, $foundIds);

                Log::error('Update - Some problems do not exist in either table:', [
                    'submitted' => $problemIds,
                    'found_in_problems' => $standardProblemIds,
                    'found_in_leetcode' => $leetcodeProblemIds,
                    'missing' => $missingIds
                ]);

                return response()->json([
                    'errors' => [
                        'problem_ids' => ["The following problem IDs don't exist in our database: " . implode(', ', $missingIds)]
                    ]
                ], 422);
            }
        }

        try {
            DB::beginTransaction();

            // Update the challenge
            $challenge->update($request->only([
                'name', 'description', 'level', 'skill_id'
            ]));

            // Update problems if provided
            if ($request->has('problem_ids')) {
                // Handle standard problems
                // Detach all standard problems
                $challenge->problems()->detach();

                // Attach new standard problems with order if any
                if (!empty($standardProblemIds)) {
                    $problemOrder = [];
                    foreach ($standardProblemIds as $index => $problemId) {
                        $problemOrder[$problemId] = ['order' => $index];
                    }
                    $challenge->problems()->attach($problemOrder);
                }

                // Handle LeetCode problems
                // First, reset all leetcode problems that were previously part of this challenge
                LeetcodeProblem::where('challenge_id', $challenge->id)
                    ->update(['challenge_id' => null]);

                // Then set the challenge_id for any leetcode problems in the new list
                if (!empty($leetcodeProblemIds)) {
                    LeetcodeProblem::whereIn('id', $leetcodeProblemIds)
                        ->update(['challenge_id' => $challenge->id]);
                }
            }

            DB::commit();

            // Return the challenge with problems
            $challenge->load(['skill', 'problems' => function($query) {
                $query->with('skill')->orderBy('challenge_problem.order');
            }, 'leetcodeProblems']);

            return response()->json($challenge);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating challenge: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'challenge_id' => $challenge->id,
                'data' => $request->all(),
                'exception_type' => get_class($e)
            ]);

            return response()->json([
                'message' => 'Failed to update challenge',
                'error' => $e->getMessage()
            ], 500);
        }
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
        // Get standard problems
        $standardProblems = $challenge->problems()
            ->with('skill')
            ->orderBy('challenge_problem.order')
            ->get();

        // Get leetcode problems
        $leetcodeProblems = $challenge->leetcodeProblems()
            ->with('skill')
            ->get();

        // Normalize and combine problems
        $combinedProblems = $standardProblems->map(function($problem) {
            return [
                'id' => $problem->id,
                'name' => $problem->name,
                'description' => $problem->description,
                'level' => $problem->level,
                'skill' => $problem->skill,
                'source' => 'standard',
                'order' => $problem->pivot->order,
                // Include other necessary fields
            ];
        })->concat(
            $leetcodeProblems->map(function($problem) {
                return [
                    'id' => $problem->id,
                    'name' => $problem->title,
                    'description' => $problem->description,
                    'level' => $problem->difficulty,
                    'skill' => $problem->skill,
                    'source' => 'leetcode',
                    'order' => 1000 + $problem->id, // Ensure leetcode problems come after standard ones
                ];
            })
        )->sortBy('order')->values();

        return response()->json($combinedProblems);
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
            'problem_id' => 'required|integer',
            'completed' => 'required|boolean',
            'problem_type' => 'required|in:standard,leetcode',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $candidateId = $request->input('candidate_id');
        $problemId = $request->input('problem_id');
        $problemType = $request->input('problem_type');
        $completed = $request->input('completed');

        // Check if the problem belongs to this challenge
        $problemExists = false;
        if ($problemType === 'standard') {
            $problemExists = $challenge->problems()->where('problems.id', $problemId)->exists();
        } else if ($problemType === 'leetcode') {
            $problemExists = $challenge->leetcodeProblems()->where('id', $problemId)->exists();
        }

        if (!$problemExists) {
            return response()->json(['message' => 'Problem does not belong to this challenge'], 400);
        }

        // Get the enrollment record
        $enrollment = $challenge->candidates()->where('candidate_id', $candidateId)->first();

        if (!$enrollment) {
            return response()->json(['message' => 'You are not enrolled in this challenge'], 404);
        }

        // For tracking completed problems
        $problemKey = $problemType === 'standard' ? $problemId : 'leetcode_' . $problemId;

        // Mark the problem as completed for the candidate if not already
        if ($completed) {
            // We'll use candidate_problem table for both types, but add a type field to distinguish
            $existingRecord = DB::table('candidate_problem')
                ->where('candidate_id', $candidateId)
                ->where('challenge_id', $challenge->id)
                ->where('problem_id', $problemId)
                ->where('problem_type', $problemType)
                ->exists();

            if (!$existingRecord) {
                // Insert the completed problem record
                DB::table('candidate_problem')->insert([
                    'candidate_id' => $candidateId,
                    'problem_id' => $problemId,
                    'challenge_id' => $challenge->id,
                    'problem_type' => $problemType,
                    'completed_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Calculate completed problems
                $completedProblemsCount = DB::table('candidate_problem')
                    ->where('candidate_id', $candidateId)
                    ->where('challenge_id', $challenge->id)
                    ->count();

                // Calculate total problems in challenge (both standard and leetcode)
                $totalStandardProblems = $challenge->problems()->count();
                $totalLeetcodeProblems = $challenge->leetcodeProblems()->count();
                $totalProblems = $totalStandardProblems + $totalLeetcodeProblems;

                // Update the pivot table
                $challenge->candidates()->updateExistingPivot($candidateId, [
                    'completed_problems' => $completedProblemsCount
                ]);

                // Check if all problems are completed
                if ($completedProblemsCount >= $totalProblems) {
                    $certificateId = $this->generateCertificateId($candidateId, $challenge->id);

                    $challenge->candidates()->updateExistingPivot($candidateId, [
                        'is_completed' => true,
                        'completion_date' => now(),
                        'certificate_id' => $certificateId
                    ]);

                    return response()->json([
                        'message' => 'Congratulations! You have completed this challenge.',
                        'progress' => [
                            'completed' => $completedProblemsCount,
                            'total' => $totalProblems,
                            'percentage' => ($totalProblems > 0) ? ($completedProblemsCount / $totalProblems) * 100 : 0,
                        ],
                        'certificate_id' => $certificateId
                    ]);
                }

                return response()->json([
                    'message' => 'Progress updated',
                    'progress' => [
                        'completed' => $completedProblemsCount,
                        'total' => $totalProblems,
                        'percentage' => ($totalProblems > 0) ? ($completedProblemsCount / $totalProblems) * 100 : 0,
                    ]
                ]);
            }
        }

        // Calculate current progress
        $completedProblemsCount = DB::table('candidate_problem')
            ->where('candidate_id', $candidateId)
            ->where('challenge_id', $challenge->id)
            ->count();

        $totalStandardProblems = $challenge->problems()->count();
        $totalLeetcodeProblems = $challenge->leetcodeProblems()->count();
        $totalProblems = $totalStandardProblems + $totalLeetcodeProblems;

        return response()->json([
            'message' => 'No change in progress',
            'progress' => [
                'completed' => $completedProblemsCount,
                'total' => $totalProblems,
                'percentage' => ($totalProblems > 0) ? ($completedProblemsCount / $totalProblems) * 100 : 0,
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
            ->get(['problem_id', 'problem_type']);

        // Separate completed problems by type
        $completedStandardIds = $completedProblems
            ->where('problem_type', 'standard')
            ->pluck('problem_id')
            ->toArray();

        $completedLeetcodeIds = $completedProblems
            ->where('problem_type', 'leetcode')
            ->pluck('problem_id')
            ->toArray();

        // Get all problem IDs with type indicator
        $allCompletedIds = $completedProblems->map(function($item) {
            return [
                'id' => $item->problem_id,
                'type' => $item->problem_type
            ];
        })->toArray();

        // Calculate total problems in challenge (both standard and leetcode)
        $totalStandardProblems = $challenge->problems()->count();
        $totalLeetcodeProblems = $challenge->leetcodeProblems()->count();
        $totalProblems = $totalStandardProblems + $totalLeetcodeProblems;

        // Calculate completion percentage
        $completedCount = count($completedProblems);
        $percentage = ($totalProblems > 0) ? ($completedCount / $totalProblems) * 100 : 0;

        return response()->json([
            'is_enrolled' => true,
            'completed_problems' => $completedCount,
            'total_problems' => $totalProblems,
            'total_standard_problems' => $totalStandardProblems,
            'total_leetcode_problems' => $totalLeetcodeProblems,
            'percentage' => $percentage,
            'completed_standard_problems' => $completedStandardIds,
            'completed_leetcode_problems' => $completedLeetcodeIds,
            'completed_problems_ids' => $allCompletedIds,
            'is_completed' => $enrollment->pivot->is_completed,
            'completion_date' => $enrollment->pivot->completion_date,
            'certificate_id' => $enrollment->pivot->certificate_id
        ]);
    }

    /**
     * Mark a problem as completed for a candidate.
     * This method should ONLY be called when a candidate has successfully solved a problem.
     * The frontend code in ProblemWorkspace.js and LeetcodeProblemWorkspace.jsx ensures this
     * by only calling this endpoint when a solution passes all test cases.
     */
    public function markProblemCompleted(Request $request, $problemId)
    {
        $validator = Validator::make($request->all(), [
            'candidate_id' => 'required|exists:candidates,id',
            'problem_type' => 'required|in:standard,leetcode',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $candidateId = $request->input('candidate_id');
        $problemType = $request->input('problem_type');

        // Find all challenges that contain this problem
        $challenges = [];

        if ($problemType === 'standard') {
            // Find challenges that contain this standard problem
            $challenges = Challenge::whereHas('problems', function($query) use ($problemId) {
                $query->where('problems.id', $problemId);
            })->get();
        } else if ($problemType === 'leetcode') {
            // Find challenges that contain this leetcode problem
            $challenges = Challenge::whereHas('leetcodeProblems', function($query) use ($problemId) {
                $query->where('id', $problemId);
            })->get();
        }

        if ($challenges->isEmpty()) {
            return response()->json(['message' => 'Problem is not part of any challenge'], 404);
        }

        $updatedChallenges = [];

        foreach ($challenges as $challenge) {
            // Check if the candidate is enrolled in this challenge
            $enrollment = $challenge->candidates()->where('candidate_id', $candidateId)->first();

            if (!$enrollment) {
                // If candidate is not enrolled, enroll them automatically
                $challenge->candidates()->attach($candidateId, [
                    'completed_problems' => 0,
                    'is_completed' => false
                ]);
            }

            // Check if this problem is already marked as completed
            $existingRecord = DB::table('candidate_problem')
                ->where('candidate_id', $candidateId)
                ->where('challenge_id', $challenge->id)
                ->where('problem_id', $problemId)
                ->where('problem_type', $problemType)
                ->exists();

            if (!$existingRecord) {
                // Insert the completed problem record
                DB::table('candidate_problem')->insert([
                    'candidate_id' => $candidateId,
                    'problem_id' => $problemId,
                    'challenge_id' => $challenge->id,
                    'problem_type' => $problemType,
                    'completed_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Calculate completed problems
                $completedProblemsCount = DB::table('candidate_problem')
                    ->where('candidate_id', $candidateId)
                    ->where('challenge_id', $challenge->id)
                    ->count();

                // Calculate total problems in challenge (both standard and leetcode)
                $totalStandardProblems = $challenge->problems()->count();
                $totalLeetcodeProblems = $challenge->leetcodeProblems()->count();
                $totalProblems = $totalStandardProblems + $totalLeetcodeProblems;

                // Update the pivot table
                $challenge->candidates()->updateExistingPivot($candidateId, [
                    'completed_problems' => $completedProblemsCount
                ]);

                // Check if all problems are completed
                if ($completedProblemsCount >= $totalProblems) {
                    $certificateId = $this->generateCertificateId($candidateId, $challenge->id);

                    $challenge->candidates()->updateExistingPivot($candidateId, [
                        'is_completed' => true,
                        'completion_date' => now(),
                        'certificate_id' => $certificateId
                    ]);

                    $updatedChallenges[] = [
                        'id' => $challenge->id,
                        'name' => $challenge->name,
                        'completed' => true,
                        'certificate_id' => $certificateId
                    ];
                } else {
                    $updatedChallenges[] = [
                        'id' => $challenge->id,
                        'name' => $challenge->name,
                        'completed' => false,
                        'progress' => [
                            'completed' => $completedProblemsCount,
                            'total' => $totalProblems,
                            'percentage' => ($totalProblems > 0) ? ($completedProblemsCount / $totalProblems) * 100 : 0,
                        ]
                    ];
                }
            } else {
                $updatedChallenges[] = [
                    'id' => $challenge->id,
                    'name' => $challenge->name,
                    'message' => 'Problem already completed in this challenge'
                ];
            }
        }

        return response()->json([
            'message' => 'Problem marked as completed in relevant challenges',
            'updated_challenges' => $updatedChallenges
        ]);
    }
}
