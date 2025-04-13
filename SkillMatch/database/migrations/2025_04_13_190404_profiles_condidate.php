<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('profile_candidat', function (Blueprint $table) {
            $table->id();
            $table->json('experience')->nullable(); // to make sure that this variable in zn array
            $table->json('formation')->nullable();  // to make sure that this variable in zn array
            $table->string('photoProfil')->nullable();
            $table->json('langage')->nullable();    // to make sure that this variable in zn array
            $table->json('localisation')->nullable(); // to make sure that this variable in zn array
            $table->json('competenceList')->nullable();
            $table->foreignId('candidate_id')->constrained('candidates')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('profile_candidat');
    }
};
