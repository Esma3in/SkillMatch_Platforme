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
        Schema::create('profile_companies' ,function(Blueprint $table){
            $table->id();
            $table->string('serieNumber')->unique();
            $table->string('reasonSocial')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->double('capital')->nullable();
            $table->double('salesfigures')->nullable();
            $table->bigInteger('nbEmployers')->nullable();
            $table->date('DateCreation')->nullable();
            $table->text('Bio')->nullable();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_companies');
    }
};
