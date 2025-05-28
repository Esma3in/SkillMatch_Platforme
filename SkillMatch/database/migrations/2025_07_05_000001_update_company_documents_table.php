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
        // Skip if table doesn't exist
        if (!Schema::hasTable('company_documents')) {
            return;
        }

        // Make modifications to the existing table
        Schema::table('company_documents', function (Blueprint $table) {
            // Check if columns exist before adding them
            if (!Schema::hasColumn('company_documents', 'status')) {
                $table->string('status')->default('pending')->after('is_validated');
            }

            // Add any other modifications needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse modifications
        if (Schema::hasTable('company_documents') &&
            Schema::hasColumn('company_documents', 'status')) {
            Schema::table('company_documents', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }
    }
};
