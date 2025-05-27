<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyDocument;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class MigrateCompanyFilesToDocumentsSeeder extends Seeder
{
    /**
     * Run the database seeds to migrate existing company files to the company_documents table
     */
    public function run(): void
    {
        $companies = Company::all();

        $this->command->info('Migrating existing company documents...');
        $count = 0;

        foreach ($companies as $company) {
            // Skip if no file exists
            if (!$company->file) {
                continue;
            }

            // Check if this document already exists in company_documents
            $exists = CompanyDocument::where('company_id', $company->id)
                ->where('file_path', $company->file)
                ->exists();

            if (!$exists) {
                try {
                    CompanyDocument::create([
                        'company_id' => $company->id,
                        'document_type' => 'Legal Identification Document',
                        'file_path' => $company->file,
                        'is_validated' => false,
                        'status' => 'pending'
                    ]);
                    $count++;
                } catch (\Exception $e) {
                    Log::error('Failed to migrate document for company ID: ' . $company->id . ' - ' . $e->getMessage());
                }
            }
        }

        $this->command->info("Migrated $count company documents successfully.");
    }
}
