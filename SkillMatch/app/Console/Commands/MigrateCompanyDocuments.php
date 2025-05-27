<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\MigrateCompanyFilesToDocumentsSeeder;

class MigrateCompanyDocuments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'company:migrate-documents';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing company files to the company_documents table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of company documents...');

        $seeder = new MigrateCompanyFilesToDocumentsSeeder();
        $seeder->setCommand($this);
        $seeder->run();

        $this->info('Company documents migration completed!');

        return Command::SUCCESS;
    }
}
