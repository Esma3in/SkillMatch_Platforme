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
        // First, add the description field to challenges table if it doesn't exist
        if (!Schema::hasColumn('challenges', 'description')) {
            Schema::table('challenges', function (Blueprint $table) {
                $table->text('description')->nullable()->after('name');
            });
        }

        // Remove the skill_id constraint if needed
        if (Schema::hasColumn('challenges', 'skill_id')) {
            Schema::table('challenges', function (Blueprint $table) {
                // Make skill_id nullable as it's no longer required
                $table->foreignId('skill_id')->nullable()->change();
            });
        }

        // Create challenge_problem pivot table
        Schema::create('challenge_problem', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenge_id')->constrained()->onDelete('cascade');
            $table->foreignId('problem_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Prevent duplicate entries
            $table->unique(['challenge_id', 'problem_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the pivot table
        Schema::dropIfExists('challenge_problem');

        // We don't revert the challenges table changes to maintain data integrity
    }
};
