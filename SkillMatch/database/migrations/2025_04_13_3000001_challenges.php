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
        Schema::create('Challenges' ,function(Blueprint $table){
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('figure')->nullable();
            $table->string('tags');
            $table->string('level');
            $table->text('example');
            $table->text('inputFormat');
            $table->text('outputFormat');
            // relations
            $table->foreignId('skill_id')->constrained('Skills')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('administrator_id')->constrained('administrators')->onDelete('cascade')->onUpdate('cascade');
            

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Challenges');
    }
};
