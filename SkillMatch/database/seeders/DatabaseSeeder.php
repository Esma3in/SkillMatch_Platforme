<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Models\RoadMapTest;
use App\Models\ProfileCompany;
use App\Models\SerieChallenge;
use App\Models\Profile_Company;
use Illuminate\Database\Seeder;
use App\Models\ProfileCandidate;
use App\Models\Profile_candidate;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Administrators
        \App\Models\Administrator::factory(3)->create();

        // Create Companies and their Profiles, Roadmaps, Challenges
        \App\Models\Company::factory(5)->create()->each(function ($company) {
            $profile = ProfileCompany::factory()->create(['company_id' => $company->id]);
            
            // Create Challenges with Series, Tests and Roadmap_Tests
            \App\Models\Challenge::factory(3)->create()->each(function ($challenge) use ($company) {
                SerieChallenge::factory(10)->create();

                \App\Models\Test::factory(2)->create()->each(function ($test) {
                    RoadMapTest::factory()->create();
                });
            });

            // Notifications
            \App\Models\Notification::factory(2)->create(['company_id' => $company->id]);
        });

        // Create Candidates and their related data
        \App\Models\Candidate::factory(10)->create()->each(function ($candidate) {
            ProfileCandidate::factory()->create(['candidate_id' => $candidate->id]);
            \App\Models\Experience::factory(2)->create();
            \App\Models\Formation::factory(2)->create();
            \App\Models\Attestation::factory(2)->create();
            \App\Models\Document::factory(1)->create();
            \App\Models\Skill::factory(3)->create(['candidate_id' => $candidate->id]);
            \App\Models\Badge::factory(1)->create(['candidate_id' => $candidate->id]);
            \App\Models\Roadmap::factory(2)->create(['candidate_id' => $candidate->id]);

            // Link Results to existing Tests
            Test::inRandomOrder()->take(2)->get()->each(function ($test) use ($candidate) {
                \App\Models\Result::factory()->create([
                    'candidate_id' => $candidate->id,
                    'test_id' => $test->id
                ]);
            });
        });
    }
}
