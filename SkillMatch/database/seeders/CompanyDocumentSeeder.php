<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyDocument;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class CompanyDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all companies instead of just the first 3
        $companies = Company::all();

        if ($companies->isEmpty()) {
            $this->command->info('No companies found. Please run the company seeder first.');
            return;
        }

        // Create a sample PDF in storage
        $samplePdfPath = storage_path('app/public/company_documents');
        if (!File::exists($samplePdfPath)) {
            File::makeDirectory($samplePdfPath, 0755, true);
        }

        // Create documents for each company
        foreach ($companies as $company) {
            // Legal identification document types
            $documentTypes = [
                'Insurance ID Certificate',
                'Company Registration Certificate',
                'Legal Identification Document',
                'Business License'
            ];

            foreach ($documentTypes as $documentType) {
                // Create a dummy text file with some content
                $fileName = strtolower(str_replace(' ', '_', $documentType)) . '_' . $company->id . '.txt';
                $filePath = 'company_documents/' . $fileName;

                // Create the file content
                $content = "This is a sample {$documentType} document for company: {$company->name}\n";
                $content .= "Created for testing purposes.\n";
                $content .= "Company ID: {$company->id}\n";
                $content .= "Document Type: {$documentType}\n";
                $content .= "Date: " . now()->format('Y-m-d H:i:s');

                // Store the file
                Storage::disk('public')->put($filePath, $content);

                // Create database record with random status
                $isValidated = rand(0, 2); // 0: pending, 1: valid, 2: invalid
                $status = ['pending', 'valid', 'invalid'][$isValidated];

                CompanyDocument::create([
                    'company_id' => $company->id,
                    'document_type' => $documentType,
                    'file_path' => $filePath,
                    'is_validated' => $isValidated === 1, // Only valid documents are is_validated=true
                    'status' => $status,
                    'validated_at' => $isValidated > 0 ? now() : null, // Both valid and invalid have validated_at
                ]);
            }
        }

        $this->command->info(count($companies) * count($documentTypes) . ' sample documents created successfully.');
    }
}
