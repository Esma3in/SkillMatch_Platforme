<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrerequisitesTable extends Migration
{
    public function up()
    {
        Schema::create('prerequisites', function (Blueprint $table) {
            $table->id();
            $table->string('text');
            $table->boolean('completed')->default(false);
            $table->timestamps();

            // Optional: Add foreign key constraints
            $table->foreignId('roadmap_id')->constrained('roadmaps');
            $table->foreignId('candidate_id')->constrained('candidates');
        });
    }

    public function down()
    {
        Schema::dropIfExists('prerequisites');
    }
}