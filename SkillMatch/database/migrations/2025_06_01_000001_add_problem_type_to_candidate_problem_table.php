<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, check if the column already exists
        if (!Schema::hasColumn('candidate_problem', 'problem_type')) {
            // Add problem_type column
            Schema::table('candidate_problem', function (Blueprint $table) {
                $table->string('problem_type')->default('standard')->after('problem_id');
            });
        }

        // Now try to drop the unique constraint by name (which might fail, but we continue)
        try {
            Schema::table('candidate_problem', function (Blueprint $table) {
                $table->dropUnique('candidate_problem_candidate_id_problem_id_challenge_id_unique');
            });
        } catch (\Exception $e) {
            // The index might not exist or have a different name, we can proceed
        }

        // Add our new unique constraint (will fail if it already exists, but we try-catch)
        try {
            Schema::table('candidate_problem', function (Blueprint $table) {
                $table->unique(['candidate_id', 'problem_id', 'challenge_id', 'problem_type'], 'candidate_problem_unique');
            });
        } catch (\Exception $e) {
            // If adding the index fails, we can log the error but proceed
            DB::statement('ALTER TABLE candidate_problem ADD CONSTRAINT candidate_problem_unique UNIQUE (candidate_id, problem_id, challenge_id, problem_type)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Try to drop the new constraint
        try {
            Schema::table('candidate_problem', function (Blueprint $table) {
                $table->dropUnique('candidate_problem_unique');
            });
        } catch (\Exception $e) {
            // If dropping fails, we can proceed
        }

        // Try to add back the original constraint
        try {
            Schema::table('candidate_problem', function (Blueprint $table) {
                $table->unique(['candidate_id', 'problem_id', 'challenge_id']);
            });
        } catch (\Exception $e) {
            // If adding back fails, we can proceed
        }

        // Drop the column if it exists
        if (Schema::hasColumn('candidate_problem', 'problem_type')) {
            Schema::table('candidate_problem', function (Blueprint $table) {
                $table->dropColumn('problem_type');
            });
        }
    }
};
