<?php

namespace App\Console\Commands;

use App\Models\CompanyDocument;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use FPDF;

class GenerateMissingDocumentFiles extends Command
{
    protected $signature = 'documents:generate-missing';

    protected $description = 'Generate placeholder files for missing company documents';

    public function handle()
    {
        $this->info('Generating missing document files...');

        $documents = CompanyDocument::all();
        $total = $documents->count();
        $regenerated = 0;

        $this->output->progressStart($total);

        foreach ($documents as $document) {
            $this->output->progressAdvance();

            // Check if the file exists in storage
            $exists = Storage::disk('public')->exists($document->file_path);

            if (!$exists) {
                // Get file extension
                $extension = pathinfo($document->file_path, PATHINFO_EXTENSION);

                if (empty($extension)) {
                    // Default to PDF if no extension
                    $extension = 'pdf';
                    $document->file_path .= '.pdf';
                    $document->save();
                }

                // Make sure the directory exists
                $directory = dirname($document->file_path);
                if ($directory && $directory !== '.') {
                    Storage::disk('public')->makeDirectory($directory);
                }

                switch (strtolower($extension)) {
                    case 'pdf':
                        $this->generatePdf($document);
                        break;
                    case 'txt':
                        $this->generateTextFile($document);
                        break;
                    default:
                        $this->generateTextFile($document); // Fallback to text for unsupported types
                }

                $regenerated++;
            }
        }

        $this->output->progressFinish();

        $this->newLine();
        $this->info("Document generation complete:");
        $this->info("- Regenerated files: {$regenerated} out of {$total}");

        return Command::SUCCESS;
    }

    protected function generatePdf(CompanyDocument $document)
    {
        // Use FPDF if available, otherwise create a simple text file
        if (class_exists('FPDF')) {
            $pdf = new FPDF();
            $pdf->AddPage();
            $pdf->SetFont('Arial', 'B', 16);

            // Document title
            $pdf->Cell(0, 20, 'Sample Document', 0, 1, 'C');
            $pdf->SetFont('Arial', '', 12);

            // Document content - company info
            $pdf->Cell(0, 10, 'Document Type: ' . $document->document_type, 0, 1);
            $pdf->Cell(0, 10, 'Document ID: ' . $document->id, 0, 1);
            $pdf->Cell(0, 10, 'Company ID: ' . $document->company_id, 0, 1);
            $pdf->Cell(0, 10, 'Created: ' . $document->created_at, 0, 1);

            // Add more content
            $pdf->Ln(10);
            $pdf->MultiCell(0, 10, 'This is a sample document generated for testing purposes. In a real scenario, this would be an official company document uploaded during registration.');

            // Output to storage
            $tempPath = sys_get_temp_dir() . '/' . uniqid('doc_') . '.pdf';
            $pdf->Output('F', $tempPath);

            // Move to proper storage location
            $content = file_get_contents($tempPath);
            Storage::disk('public')->put($document->file_path, $content);

            // Clean up temp file
            @unlink($tempPath);

            $this->line("Generated PDF: {$document->file_path}");
        } else {
            // Fallback to text if FPDF not available
            $this->generateTextFile($document, true);
        }
    }

    protected function generateTextFile(CompanyDocument $document, $isPdfFallback = false)
    {
        // Create a sample text file with document info
        $content = "SAMPLE DOCUMENT\n\n";
        $content .= "Document Type: {$document->document_type}\n";
        $content .= "Document ID: {$document->id}\n";
        $content .= "Company ID: {$document->company_id}\n";
        $content .= "Created: {$document->created_at}\n\n";
        $content .= "This is a sample document generated for testing purposes.\n";
        $content .= "In a real scenario, this would be an official company document uploaded during registration.\n";

        // Store the content
        Storage::disk('public')->put($document->file_path, $content);

        if ($isPdfFallback) {
            $this->warn("Generated TXT instead of PDF (FPDF not available): {$document->file_path}");
        } else {
            $this->line("Generated TXT: {$document->file_path}");
        }
    }
}
