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
        Schema::create('qcms', function (Blueprint $table) {
            $table->id();
            $table->text('question');           // The question text
            $table->string('option_a');         // First possible answer
            $table->string('option_b');         // Second possible answer
            $table->string('option_c');         // Third possible answer
            $table->string('option_d');         // Fourth possible answer
            $table->string('corrected_option'); // Correct option
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qcms');
    }
};
