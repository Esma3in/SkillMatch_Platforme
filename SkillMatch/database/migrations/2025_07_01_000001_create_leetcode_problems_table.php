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
        Schema::create('leetcode_problems', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('constraints')->nullable();
            $table->json('examples'); // Store input/output examples as JSON
            $table->enum('difficulty', ['easy', 'medium', 'hard']);
            $table->json('test_cases'); // Store test cases as JSON
            $table->json('starter_code'); // Store starter code for different languages as JSON
            $table->json('solution_code')->nullable(); // Store solution code for different languages as JSON
            $table->foreignId('skill_id')->constrained('Skills')->onUpdate('cascade');
            $table->foreignId('challenge_id')->nullable()->constrained('challenges')->onDelete('set null');
            $table->foreignId('creator_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leetcode_problems');
    }
};
