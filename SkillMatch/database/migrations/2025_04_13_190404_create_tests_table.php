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
      
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->text('objective');
            $table->text('prerequisites');
            $table->text('tools_Required');
            $table->text('before_answer');
            $table->foreignid('qcm_id')->constrained('qcms');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('skill_id');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('skill_id')->references('id')->on('skills')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
