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
        Schema::create('roadmapsprogress' , function(Blueprint $table){
            $table->id() ;
            $table->foreignId('roadmap_id')->constrained('roadmaps')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('candidate_id')->constrained('candidates')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('progress')->nullable();
            $table->json('steps')->nullable(); // Added steps column to store step completion data
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roadmapsprogress');
    }
};
