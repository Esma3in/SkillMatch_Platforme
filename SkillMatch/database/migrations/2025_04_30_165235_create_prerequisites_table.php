<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrerequisitesTable extends Migration
{
        public function up(): void
        {
            Schema::create('prerequisites', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('skill_id');
                $table->string('text');
                $table->boolean('completed')->default(false);
                $table->timestamps();
    
                $table->foreign('skill_id')->references('id')->on('skills')->onDelete('cascade');
            });
        }

    public function down()
    {
        Schema::dropIfExists('prerequisites');
    }
}
