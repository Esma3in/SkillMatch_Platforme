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
        Schema::create('series_roadmap_test', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('roadmap_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->integer('total_score');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('series_roadmap_test');
    }
};
