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
        Schema::create("Results" , function (Blueprint $table) {
            $table->id();
            $table->double('score');
            $table->string('candidateAnswer');
            $table->string('correctAnswer');
            $table->foreignId('candidate_id')->constrained()->onDelete("cascade");
            $table->foreignId('test_id')->constrained()->onDelete('cascade');
            $table->foreignId('qcm_for_roadmapId')->constrained('qcm_for_roadmaps')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Results');
    }
};
