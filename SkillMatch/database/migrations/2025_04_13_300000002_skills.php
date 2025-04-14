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
        Schema::create('skills' , function(Blueprint $table){
            $table->id();
            $table->string('name');
            $table->string('level');
            $table->string('type');
            $table->string('usageFrequency');
            $table->string('classement');
            $table->foreignId('candidate_id')->nullable()->constrained();
            $table->foreignId('company_id')->nullable()->constrained();
            $table->foreignId('test_id')->nullable()->constrained('Tests');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Skills');
    }
};
