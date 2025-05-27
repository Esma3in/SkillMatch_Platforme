<?php

namespace App\Console\Commands;

use App\Models\CompanyDocument;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CheckCompanyDocumentFiles extends Command
{
    protected $signature = 'documents:check-files';

    protected $description = 'Check if all document files in the database exist in storage';

    public function handle()
    {
        $this->info('Checking company document files...');

        $documents = CompanyDocument::all();
        $total = $documents->count();
        $missing = 0;
        $existing = 0;

        $this->output->progressStart($total);

        foreach ($documents as $document) {
            $this->output->progressAdvance();

            // Check if the file exists in storage
            $exists = Storage::disk('public')->exists($document->file_path);

            if (!$exists) {
                $missing++;
                $this->warn("File missing: {$document->file_path} (Document ID: {$document->id})");
            } else {
                $existing++;
                // Get file size in KB
                $size = round(Storage::disk('public')->size($document->file_path) / 1024, 2);
                $this->line("File exists: {$document->file_path} (Size: {$size} KB)");
            }
        }

        $this->output->progressFinish();

        $this->newLine();
        $this->info("Document files check complete:");
        $this->info("- Total documents: {$total}");
        $this->info("- Existing files: {$existing}");
        $this->warn("- Missing files: {$missing}");

        return Command::SUCCESS;
    }
}
