<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateToolsTable extends Migration
{
    public function up()
    {
        Schema::create('tools', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('link')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
            $table->foreignId('roadmap_id')->constrained('roadmaps');
            $table->foreignId('candidate_id')->constrained('candidates');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tools');
    }
}