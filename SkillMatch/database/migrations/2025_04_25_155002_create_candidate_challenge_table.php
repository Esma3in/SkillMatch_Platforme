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
        Schema::create('candidate_challenge', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->foreignId('challenge_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('completed_problems')->default(0);
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completion_date')->nullable();
            $table->string('certificate_id')->nullable()->unique(); // Unique identifier for certificate
            $table->timestamps();

            // Prevent duplicate enrollments
            $table->unique(['candidate_id', 'challenge_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_challenge');
    }
};
