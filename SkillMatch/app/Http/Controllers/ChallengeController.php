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
use App\Models\ChallengeResult;
use App\Models\ProblemResult;

class ChallengeController extends Controller
{
    /**
     * Display a listing of the challenges.
     */
    public function index()
    {
        $challenges = Challenge::with('skill')
            ->withCount(['problems', 'leetcodeProblems', 'candidates'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Add combined problem count to each challenge
        $challenges->getCollection()->transform(function ($challenge) {
            // Add a combined count of all problems
            $challenge->problems_count = $challenge->problems_count + $challenge->leetcode_problems_count;
            return $challenge;
        });

        return response()->json($challenges);
    }

    /**
     * Display the specified challenge.
     */
    public function show(Challenge $challenge)
    {
        $challenge->load(['skill', 'problems' => function($query) {
            $query->with('skill');
        }, 'leetcodeProblems' => function($query) {
            $query->with('skill');
        }]);

        // Combine all problems into one collection
        $allProblems = $challenge->problems->concat($challenge->leetcodeProblems);
        $challenge->problems_count = $allProblems->count();

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
        $validator = Validator::make($request->all(), [
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $candidateId = $request->input('candidate_id');

        // Check if the candidate is already enrolled
        $existingResult = ChallengeResult::where([
            'candidate_id' => $candidateId,
            'challenge_id' => $challenge->id
        ])->first();

        if ($existingResult) {
            return response()->json([
                'message' => 'Candidate is already enrolled in this challenge',
                'challenge_result' => $existingResult
            ]);
        }

        // Calculate total problems
        $totalStandardProblems = $challenge->problems()->count();
        $totalLeetcodeProblems = $challenge->leetcodeProblems()->count();
        $totalProblems = $totalStandardProblems + $totalLeetcodeProblems;

        // Create new challenge result
        $challengeResult = ChallengeResult::create([
            'candidate_id' => $candidateId,
            'challenge_id' => $challenge->id,
            'status' => 'in_progress',
            'problems_completed' => 0,
            'total_problems' => $totalProblems,
            'completion_percentage' => 0,
            'started_at' => now()
            ]);

        // For backward compatibility, keep the old enrollment logic too
        // but in the future, we should phase this out
        $challenge->candidates()->syncWithoutDetaching([
            $candidateId => [
            'completed_problems' => 0,
            'is_completed' => false
            ]
        ]);

        return response()->json([
            'message' => 'Challenge started successfully',
            'challenge_result' => $challengeResult
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
        // First try to find in the new table
        $challengeResult = ChallengeResult::where('certificate_id', $certificateId)->first();

        if ($challengeResult) {
            $challenge = Challenge::findOrFail($challengeResult->challenge_id);
            $candidate = Candidate::findOrFail($challengeResult->candidate_id);

            return response()->json([
                'certificate_id' => $certificateId,
                'candidate_name' => $candidate->name,
                'challenge_name' => $challenge->name,
                'skill' => $challenge->skill->name,
                'completion_date' => Carbon::parse($challengeResult->completed_at)->format('F d, Y'),
                'level' => $challenge->level
            ]);
        }

        // Fallback to the old table
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

        // Get certificates from the new table
        $newCertificates = $candidate->challengeResults()
            ->where('status', 'completed')
            ->whereNotNull('certificate_id')
            ->with('challenge.skill')
            ->get()
            ->map(function($result) {
                return [
                    'certificate_id' => $result->certificate_id,
                    'challenge_name' => $result->challenge->name,
                    'skill' => $result->challenge->skill->name,
                    'completion_date' => Carbon::parse($result->completed_at)->format('F d, Y'),
                    'level' => $result->challenge->level
                ];
            })->toArray();

        // Get certificates from the old table
        $oldCertificates = $candidate->challenges()
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
            })->toArray();

        // Merge and remove duplicates (based on certificate_id)
        $allCertificates = collect(array_merge($newCertificates, $oldCertificates))
            ->unique('certificate_id')
            ->values()
            ->all();

        return response()->json($allCertificates);
    }

    /**
     * Get all active challenges for admin.
     */
    public function getAdminChallenges()
    {
        $challenges = Challenge::with('skill')
            ->withCount(['problems', 'leetcodeProblems', 'candidates'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Add combined problem count to each challenge
        $challenges->getCollection()->transform(function ($challenge) {
            // Add a combined count of all problems
            $challenge->problems_count = $challenge->problems_count + $challenge->leetcode_problems_count;
            return $challenge;
        });

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

        // Check if the candidate has a result for this challenge
        $challengeResult = ChallengeResult::where([
            'candidate_id' => $candidateId,
            'challenge_id' => $challenge->id
        ])->first();

        if (!$challengeResult) {
            // Check the legacy data
        $enrollment = $challenge->candidates()
            ->where('candidate_id', $candidateId)
            ->first();

            if ($enrollment) {
                // Migrate the old data to the new format
                $totalProblems = $challenge->problems()->count() + $challenge->leetcodeProblems()->count();
                $completedProblems = $enrollment->pivot->completed_problems;
                $percentage = ($totalProblems > 0) ? ($completedProblems / $totalProblems) * 100 : 0;

                $challengeResult = ChallengeResult::create([
                    'candidate_id' => $candidateId,
                    'challenge_id' => $challenge->id,
                    'status' => $enrollment->pivot->is_completed ? 'completed' : 'in_progress',
                    'problems_completed' => $completedProblems,
                    'total_problems' => $totalProblems,
                    'completion_percentage' => $percentage,
                    'started_at' => $enrollment->pivot->created_at,
                    'completed_at' => $enrollment->pivot->is_completed ? $enrollment->pivot->completion_date : null,
                    'certificate_id' => $enrollment->pivot->certificate_id
                ]);
            } else {
            return response()->json([
                'is_enrolled' => false,
                'message' => 'Candidate is not enrolled in this challenge'
            ], 404);
        }
        }

        // Get completed problems from the problem_results table
        $completedProblems = ProblemResult::where([
            'candidate_id' => $candidateId,
            'challenge_id' => $challenge->id,
            'status' => 'solved'
        ])->get();

        // If we migrated from old data but don't have problem results, populate them
        if ($completedProblems->isEmpty() && $challengeResult->problems_completed > 0) {
            // We need to query the old candidate_problem table
            $oldCompletedProblems = DB::table('candidate_problem')
            ->where('candidate_id', $candidateId)
            ->where('challenge_id', $challenge->id)
                ->get();

            foreach ($oldCompletedProblems as $oldProblem) {
                ProblemResult::firstOrCreate(
                    [
                        'candidate_id' => $candidateId,
                        'problem_id' => $oldProblem->problem_id,
                        'problem_type' => $oldProblem->problem_type ?? 'standard',
                        'challenge_id' => $challenge->id,
                    ],
                    [
                        'status' => 'solved',
                        'attempts' => 1,
                        'completed_at' => $oldProblem->completed_at ?? now()
                    ]
                );
            }

            // Refresh the query
            $completedProblems = ProblemResult::where([
                'candidate_id' => $candidateId,
                'challenge_id' => $challenge->id,
                'status' => 'solved'
            ])->get();
        }

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

        return response()->json([
            'is_enrolled' => true,
            'completed_problems' => $challengeResult->problems_completed,
            'total_problems' => $challengeResult->total_problems,
            'total_standard_problems' => $challenge->problems()->count(),
            'total_leetcode_problems' => $challenge->leetcodeProblems()->count(),
            'percentage' => $challengeResult->completion_percentage,
            'completed_standard_problems' => $completedStandardIds,
            'completed_leetcode_problems' => $completedLeetcodeIds,
            'completed_problems_ids' => $allCompletedIds,
            'status' => $challengeResult->status,
            'is_completed' => $challengeResult->status === 'completed',
            'started_at' => $challengeResult->started_at,
            'completion_date' => $challengeResult->completed_at,
            'certificate_id' => $challengeResult->certificate_id
        ]);
    }

    /**
     * Mark a problem as completed for a candidate.
     * This method should ONLY be called when a candidate has successfully solved a problem.
     */
    public function markProblemCompleted(Request $request, $problemId)
    {
        $validator = Validator::make($request->all(), [
            'candidate_id' => 'required|exists:candidates,id',
            'problem_type' => 'required|in:standard,leetcode',
            'code_submitted' => 'nullable|string',
            'language' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $candidateId = $request->input('candidate_id');
        $problemType = $request->input('problem_type');
        $codeSubmitted = $request->input('code_submitted');
        $language = $request->input('language');

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
            // Check if the candidate has a result for this challenge
            $challengeResult = ChallengeResult::firstOrCreate(
                [
                    'candidate_id' => $candidateId,
                    'challenge_id' => $challenge->id
                ],
                [
                    'status' => 'in_progress',
                    'problems_completed' => 0,
                    'total_problems' => $challenge->problems()->count() + $challenge->leetcodeProblems()->count(),
                    'completion_percentage' => 0,
                    'started_at' => now()
                ]
            );

            // Check if this problem is already marked as solved
            $existingResult = ProblemResult::where([
                'candidate_id' => $candidateId,
                'problem_id' => $problemId,
                'problem_type' => $problemType,
                'challenge_id' => $challenge->id,
                'status' => 'solved'
            ])->first();

            if (!$existingResult) {
                // Find if there's an existing attempt
                $problemResult = ProblemResult::where([
                    'candidate_id' => $candidateId,
                    'problem_id' => $problemId,
                    'problem_type' => $problemType,
                    'challenge_id' => $challenge->id
                ])->first();

                if ($problemResult) {
                    // Update existing attempt
                    $problemResult->update([
                        'status' => 'solved',
                        'code_submitted' => $codeSubmitted,
                        'language' => $language,
                        'attempts' => $problemResult->attempts + 1,
                        'completed_at' => now()
                    ]);
                } else {
                    // Create new problem result
                    $problemResult = ProblemResult::create([
                    'candidate_id' => $candidateId,
                    'problem_id' => $problemId,
                    'problem_type' => $problemType,
                        'challenge_id' => $challenge->id,
                        'status' => 'solved',
                        'code_submitted' => $codeSubmitted,
                        'language' => $language,
                        'attempts' => 1,
                        'completed_at' => now()
                    ]);
                }

                // Update challenge result stats
                $challengeResult->updateCompletionStats();

                // For backward compatibility, update the old candidate_challenge pivot too
                if ($challengeResult->status === 'completed') {
                $challenge->candidates()->updateExistingPivot($candidateId, [
                        'completed_problems' => $challengeResult->problems_completed,
                        'is_completed' => true,
                        'completion_date' => $challengeResult->completed_at,
                        'certificate_id' => $challengeResult->certificate_id
                    ]);
                } else {
                    $challenge->candidates()->updateExistingPivot($candidateId, [
                        'completed_problems' => $challengeResult->problems_completed
                    ]);
                }

                    $updatedChallenges[] = [
                        'id' => $challenge->id,
                        'name' => $challenge->name,
                    'completed' => $challengeResult->status === 'completed',
                    'certificate_id' => $challengeResult->certificate_id,
                        'progress' => [
                        'completed' => $challengeResult->problems_completed,
                        'total' => $challengeResult->total_problems,
                        'percentage' => $challengeResult->completion_percentage,
                        ]
                    ];
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
