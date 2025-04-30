<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateToolSkillsTable extends Migration
{
    public function up()
    {
        Schema::create('tool_skills', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tool_id');
            $table->string('skill');
            $table->timestamps();

            $table->foreign('tool_id')->references('id')->on('tools')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tool_skills');
    }
}
