<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoadmapSkillsTable extends Migration
{
    public function up()
    {
        Schema::create('roadmap_skills', function (Blueprint $table) {
            $table->id();
            $table->string('text');
            $table->boolean('completed')->default(false);
            $table->timestamps();

            $table->foreignId('roadmap_id')->constrained('roadmaps');
            $table->foreignId('candidate_id')->constrained('candidates');
        });
    }

    public function down()
    {
        Schema::dropIfExists('roadmap_skills');
    }
}