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
        Schema::create("Challenges_Selected" , function(Blueprint $table){
            $table->id();
            $table->foreignId('challenge_id')->constrained('challenges')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('series_challenges_id')->constrained('Series_Challenges')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
