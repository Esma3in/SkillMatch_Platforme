<?php

namespace App\Console\Commands;

use App\Models\Candidate;
use App\Models\Challenge;
use App\Models\ChallengeResult;
use App\Models\ProblemResult;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateProgressData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'progress:migrate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing progress data to the new progress tracking tables';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting migration of progress data...');

        // Migrate challenge progress data
        $this->info('Migrating challenge progress data...');
        $this->migrateChallengesToResults();

        // Migrate problem completion data
        $this->info('Migrating problem completion data...');
        $this->migrateProblemCompletionsToResults();

        $this->info('Progress data migration completed successfully!');

        return 0;
    }

    /**
     * Migrate data from candidate_challenge pivot to challenge_results
     */
    private function migrateChallengesToResults()
    {
        $enrollments = DB::table('candidate_challenge')->get();
        $bar = $this->output->createProgressBar(count($enrollments));

        $bar->start();

        foreach ($enrollments as $enrollment) {
            // Check if a result already exists
            $existingResult = ChallengeResult::where([
                'candidate_id' => $enrollment->candidate_id,
                'challenge_id' => $enrollment->challenge_id
            ])->first();

            if (!$existingResult) {
                $challenge = Challenge::find($enrollment->challenge_id);
                if (!$challenge) {
                    $this->warn("Challenge with ID {$enrollment->challenge_id} not found, skipping...");
                    $bar->advance();
                    continue;
                }

                // Calculate total problems
                $totalProblems = $challenge->problems()->count() + $challenge->leetcodeProblems()->count();

                // Determine status
                $status = 'not_started';
                if ($enrollment->completed_problems > 0) {
                    $status = 'in_progress';
                    if ($enrollment->is_completed) {
                        $status = 'completed';
                    }
                }

                // Calculate percentage
                $percentage = ($totalProblems > 0) ? ($enrollment->completed_problems / $totalProblems) * 100 : 0;

                // Create the new challenge result
                ChallengeResult::create([
                    'candidate_id' => $enrollment->candidate_id,
                    'challenge_id' => $enrollment->challenge_id,
                    'status' => $status,
                    'problems_completed' => $enrollment->completed_problems,
                    'total_problems' => $totalProblems,
                    'completion_percentage' => $percentage,
                    'started_at' => $enrollment->created_at,
                    'completed_at' => $enrollment->is_completed ? $enrollment->completion_date : null,
                    'certificate_id' => $enrollment->certificate_id
                ]);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->line('');
    }

    /**
     * Migrate data from candidate_problem to problem_results
     */
    private function migrateProblemCompletionsToResults()
    {
        $completions = DB::table('candidate_problem')->get();
        $bar = $this->output->createProgressBar(count($completions));

        $bar->start();

        foreach ($completions as $completion) {
            // Check if a result already exists
            $existingResult = ProblemResult::where([
                'candidate_id' => $completion->candidate_id,
                'problem_id' => $completion->problem_id,
                'problem_type' => $completion->problem_type ?? 'standard',
                'challenge_id' => $completion->challenge_id
            ])->first();

            if (!$existingResult) {
                // Create the new problem result
                ProblemResult::create([
                    'candidate_id' => $completion->candidate_id,
                    'problem_id' => $completion->problem_id,
                    'problem_type' => $completion->problem_type ?? 'standard',
                    'challenge_id' => $completion->challenge_id,
                    'status' => 'solved',
                    'attempts' => 1,
                    'completed_at' => $completion->completed_at ?? $completion->created_at,
                    'created_at' => $completion->created_at,
                    'updated_at' => $completion->updated_at
                ]);

                // Update the challenge result
                $challengeResult = ChallengeResult::where([
                    'candidate_id' => $completion->candidate_id,
                    'challenge_id' => $completion->challenge_id
                ])->first();

                if ($challengeResult) {
                    $challengeResult->updateCompletionStats();
                }
            }

            $bar->advance();
        }

        $bar->finish();
        $this->line('');
    }
}
