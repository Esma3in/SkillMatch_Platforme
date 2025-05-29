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
        Schema::create('problem_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('problem_id');
            $table->string('problem_type'); // 'standard' or 'leetcode'
            $table->foreignId('challenge_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('status', ['attempted', 'solved', 'failed'])->default('attempted');
            $table->text('code_submitted')->nullable();
            $table->string('language')->nullable();
            $table->integer('attempts')->default(1);
            $table->integer('time_spent_seconds')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Prevent duplicate entries for the same problem-candidate-challenge combination
            $table->unique(['candidate_id', 'problem_id', 'problem_type', 'challenge_id'], 'problem_result_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problem_results');
    }
};
