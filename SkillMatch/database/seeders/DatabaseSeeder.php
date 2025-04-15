<?php

namespace Database\Seeders;

use App\Models\Profile_Company;
use Illuminate\Database\Seeder;
use Symfony\Component\HttpKernel\Profiler\Profile;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Administrators
        \App\Models\Administrator::factory(3)->create();

        // Create Companies and their Profiles, Roadmaps, Challenges
        \App\Models\Company::factory(5)->create()->each(function ($company) {
            $profile = Profile_company::factory()->create(['company_id' => $company->id]);
            
            // Roadmaps
            \App\Models\Roadmap::factory(2)->create(['company_id' => $company->id]);

            // Challenges with Series, Tests and Roadmap_Tests
            \App\Models\Challenge::factory(3)->create(['company_id' => $company->id])->each(function ($challenge) {
                \App\Models\Serie_Challenge::factory()->create(['challenge_id' => $challenge->id]);

                \App\Models\Test::factory(2)->create(['challenge_id' => $challenge->id])->each(function ($test) {
                    \App\Models\RoadMap_Test::factory()->create(['test_id' => $test->id]);
                });
            });

            // Notifications
            \App\Models\Notification::factory(2)->create(['company_id' => $company->id]);
        });

        // Create Candidates and their related data
        \App\Models\Candidate::factory(10)->create()->each(function ($candidate) {
            \App\Models\Profile_candidate::factory()->create(['candidate_id' => $candidate->id]);
            \App\Models\Experience::factory(2)->create(['candidate_id' => $candidate->id]);
            \App\Models\Formation::factory(2)->create(['candidate_id' => $candidate->id]);
            \App\Models\Attestation::factory(2)->create(['candidate_id' => $candidate->id]);
            \App\Models\Document::factory(1)->create(['candidate_id' => $candidate->id]);
            \App\Models\Skill::factory(3)->create(['candidate_id' => $candidate->id]);
            \App\Models\Badge::factory(1)->create(['candidate_id' => $candidate->id]);

            // Link Results to existing Tests
            \App\Models\Test::inRandomOrder()->take(2)->get()->each(function ($test) use ($candidate) {
                \App\Models\Result::factory()->create([
                    'candidate_id' => $candidate->id,
                    'test_id' => $test->id
                ]);
            });
        });
    }
}
