<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('candidate_problem')) {
            Schema::create('candidate_problem', function (Blueprint $table) {
                $table->id();
                $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
                $table->foreignId('problem_id')->constrained()->onDelete('cascade');
                $table->foreignId('challenge_id')->nullable()->constrained()->onDelete('cascade');
                $table->timestamp('completed_at')->nullable();
                $table->integer('time_spent')->nullable()->comment('Time spent in seconds');
                $table->integer('attempt_count')->default(1);
                $table->timestamps();

                // Prevent duplicate entries for the same candidate, problem, and challenge
                $table->unique(['candidate_id', 'problem_id', 'challenge_id']);
            });
        } else {
            // If the table exists, make sure it has the challenge_id column
            if (!Schema::hasColumn('candidate_problem', 'challenge_id')) {
                Schema::table('candidate_problem', function (Blueprint $table) {
                    $table->foreignId('challenge_id')->nullable()->constrained()->onDelete('cascade')->after('problem_id');
                });
            }

            // Add other columns if they don't exist
            if (!Schema::hasColumn('candidate_problem', 'completed_at')) {
                Schema::table('candidate_problem', function (Blueprint $table) {
                    $table->timestamp('completed_at')->nullable()->after('challenge_id');
                });
            }

            if (!Schema::hasColumn('candidate_problem', 'time_spent')) {
                Schema::table('candidate_problem', function (Blueprint $table) {
                    $table->integer('time_spent')->nullable()->comment('Time spent in seconds')->after('completed_at');
                });
            }

            if (!Schema::hasColumn('candidate_problem', 'attempt_count')) {
                Schema::table('candidate_problem', function (Blueprint $table) {
                    $table->integer('attempt_count')->default(1)->after('time_spent');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't drop the table if we just modified it
        if (Schema::hasTable('candidate_problem') &&
            Schema::hasColumn('candidate_problem', 'challenge_id') &&
            Schema::hasColumn('candidate_problem', 'completed_at') &&
            Schema::hasColumn('candidate_problem', 'time_spent') &&
            Schema::hasColumn('candidate_problem', 'attempt_count')) {
            Schema::table('candidate_problem', function (Blueprint $table) {
                $table->dropForeign(['challenge_id']);
                $table->dropColumn('challenge_id');
                $table->dropColumn('completed_at');
                $table->dropColumn('time_spent');
                $table->dropColumn('attempt_count');
            });
        } else {
            Schema::dropIfExists('candidate_problem');
        }
    }
};
