<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('company_documents', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('is_validated');
        });

        // Update existing records after the column is created
        DB::statement("UPDATE company_documents SET status = CASE WHEN is_validated = 1 THEN 'valid' ELSE 'pending' END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_documents', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
