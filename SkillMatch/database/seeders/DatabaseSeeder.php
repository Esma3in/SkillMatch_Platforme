<?php

namespace Database\Seeders;

use App\Models\Ceo;
use App\Models\Test;
use App\Models\Badge;
use App\Models\Skill;
use App\Models\Result;
use App\Models\Company;
use App\Models\Roadmap;
use App\Models\Document;
use App\Models\Candidate;
use App\Models\Challenge;
use App\Models\Formation;
use App\Models\Experience;
use App\Models\Attestation;
use App\Models\RoadMapTest;
use App\Models\Notification;
use App\Models\Administrator;
use App\Models\ProfileCompany;
use App\Models\SerieChallenge;
use App\Models\CompaniesSkills;
use Illuminate\Database\Seeder;
use App\Models\CandidatesSkills;
use App\Models\ProfileCandidate;
use Illuminate\Support\Facades\Log;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            "HTML",
            "CSS",
            "JavaScript",
            "PHP",
            "Laravel",
            "React",
            "Vue.js",
            "MySQL",
            "Git",
            "REST APIs",
            "Node.js",
            "Python",
            "Docker",
            "AWS",
            "TypeScript"
        ];
        $skillsCreated = [];
        foreach ($skills as $skill) {
            $skillcreated = Skill::factory()->create([
                'name' => $skill
            ]);
            array_push($skillsCreated, $skillcreated);
        }

        $candidates = Candidate::factory(10)->create();
        $challenges = Challenge::factory(20)->create();

        foreach ($challenges as $challenge) {
            $challenge->candidates()->attach(
                $candidates->random(rand(1, 5))->pluck('id')->toArray()
            );
        }
        // Create Administrators
        Administrator::factory(3)->create();

        // Create Companies and their Profiles, Roadmaps, Challenges
        Company::factory(5)->create()->each(function ($company) use($skillsCreated) {
            Ceo::factory()->create([
                'company_id'=>$company->id
            ]);
             ProfileCompany::factory()->create(['company_id' => $company->id]);
            $randomSkill = $skillsCreated[array_rand($skillsCreated)];
            CompaniesSkills::factory()->create([
                'company_id' => $company->id,
                'skill_id' => $randomSkill->id
            ]);
            // Create Challenges with Series, Tests and Roadmap_Tests
            Challenge::factory(3)->create()->each(function ($challenge) use ($company) {
                SerieChallenge::factory(10)->create();

                Test::factory(2)->create()->each(function ($test) {
                    RoadMapTest::factory()->create();
                });
            });

            // Notifications
            Notification::factory(2)->create(['company_id' => $company->id]);
        });


        // Create Candidates and their related data
        Candidate::factory(2)->create()->each(function ($candidate) use ($skillsCreated) {
            ProfileCandidate::factory()->create(['candidate_id' => $candidate->id]);
            Experience::factory(3)->create();
            Formation::factory(2)->create();
            Attestation::factory(2)->create();
            Document::factory(1)->create();
            $randomSkill = $skillsCreated[array_rand($skillsCreated)];
            CandidatesSkills::factory()->create([
                'candidate_id' => $candidate->id,
                'skill_id' => $randomSkill->id
            ]);
            Badge::factory(1)->create(['candidate_id' => $candidate->id]);
            Roadmap::factory(2)->create(['candidate_id' => $candidate->id]);

            // Link Results to existing Tests
            Test::inRandomOrder()->take(2)->get()->each(function ($test) use ($candidate) {
                Result::factory()->create([
                    'candidate_id' => $candidate->id,
                    'test_id' => $test->id
                ]);
            });
        });
    }
}
