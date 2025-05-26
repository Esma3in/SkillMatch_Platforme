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
        Schema::create('leetcode_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')->constrained('leetcode_problems')->onDelete('cascade');
            $table->foreignId('candidate_id')->constrained('candidates')->onDelete('cascade');
            $table->text('code_submitted');
            $table->string('language');
            $table->enum('status', ['accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compilation_error', 'pending']);
            $table->json('test_results')->nullable(); // Store detailed test results as JSON
            $table->integer('execution_time')->nullable(); // in milliseconds
            $table->integer('memory_used')->nullable(); // in KB
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leetcode_submissions');
    }
};
