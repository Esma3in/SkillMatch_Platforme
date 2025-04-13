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
        Schema::create('profile_company', function (Blueprint $table) {
            $table->id();
            $table->string('siret');
            $table->string('raisonSociale');
            $table->string('secteurActivite');
            $table->string('adresse');
            $table->string('telephone');
            $table->string('email');
            $table->string('siteweb')->nullable();
            $table->double('capital');
            $table->double('chiffreAffaires');
            $table->integer('nombreEmployes');
            $table->date('dateCreation');
            $table->string('statut');
            $table->json('competencesList')->nullable();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('profile_company');
    }
};
