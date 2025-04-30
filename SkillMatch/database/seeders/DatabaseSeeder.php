<?php

namespace Database\Seeders;

use App\Models\Ceo;
use App\Models\Step;
use App\Models\Test;
use App\Models\Badge;
use App\Models\Skill;
use App\Models\Result;
use App\Models\Company;
use App\Models\Problem;
use App\Models\Roadmap;
use App\Models\Document;
use App\Models\Candidate;
use App\Models\Challenge;
use App\Models\Formation;
use App\Models\Experience;
use App\Models\Attestation;
use App\Models\RoadMapTest;
use App\Models\SocialMedia;
use App\Models\Notification;
use App\Models\Administrator;
use App\Models\ProfileCompany;
use App\Models\QuestionOption;
use App\Models\SerieChallenge;
use App\Models\CompaniesSkills;
use Illuminate\Database\Seeder;
use App\Models\CandidatesSkills;
use App\Models\ProfileCandidate;
use App\Models\CandidateSelected;
use App\Models\CompaniesSelected;
use Illuminate\Support\Facades\DB;
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
        $levels = ['easy','meduim','hard','expert'];
        $skillsCreated = [];
        foreach ($skills as $skillName) {
            $skillsCreated[] = Skill::factory()->create([
                'name' => $skillName,
                'test_id' => null,
            ]);
        }
        $candidates = Candidate::factory(10)->create();
        // Création de 20 challenges avec chacun 20 problèmes
        Challenge::factory(20)->create()->each(function ($challenge) use ($skillsCreated, $candidates) {
            $randomSkill = $skillsCreated[array_rand($skillsCreated)];
            $challenge->skill_id = $randomSkill->id;
            $challenge->save();

            // Lier candidats
            $challenge->candidates()->attach(
                $candidates->random(rand(1, 5))->pluck('id')->toArray()
            );
        });


        foreach (range(1, 30) as $i) {
            $randomSkill = $skillsCreated[array_rand($skillsCreated)];
            Problem::factory()->create([
                'skill_id' => $randomSkill->id,
                'challenge_id' => null, // Pas lié à un challenge
            ]);
        }

        // Create Administrators
        Administrator::factory(1)->create();

        // Create Companies and their Profiles, Roadmaps, Challenges
       $companies=Company::factory(5)->create()->each(function ($company) use($skillsCreated) {
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
            CompaniesSelected::factory(10)->create([
            'candidate_id'=>$candidate->id,
            ]);
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
            Test::inRandomOrder()->get()->each(function ($test){
                Step::factory(4)->create([
                    'test_id' => $test->id
                ]);
            });
        });
        //Insert prerequisites

            DB::transaction(function () {
                // Load and validate JSON files
                $files = [
                    'prerequisites' => database_path('data/json/prerequisites.json'),
                    'courses' => database_path('data/json/candidateCourses.json'),
                    'skills' => database_path('data/json/skills.json'),
                    'tools' => database_path('data/json/tools.json'),
                ];

                foreach ($files as $key => $filePath) {
                    if (!file_exists($filePath)) {
                        throw new \Exception("File not found: $filePath");
                    }
                    $data[$key] = file_get_contents($filePath);
                    $decoded[$key] = json_decode($data[$key], true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        throw new \Exception("Invalid JSON in $key.json: " . json_last_error_msg());
                    }
                }

                // Insert prerequisites
                if (!isset($decoded['prerequisites']['prerequisites'])) {
                    throw new \Exception('Missing "prerequisites" key in prerequisites.json');
                }
                $prerequisitesData = array_map(function ($prereq) use ($decoded) {
                    return [
                        'roadmap_id' => (int) $decoded['prerequisites']['roadmap_id'],
                        'candidate_id' => (int) $decoded['prerequisites']['candidate_id'],
                        'id' => (int) $prereq['id'],
                        'text' => $prereq['text'],
                        'completed' => (bool) $prereq['completed'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }, $decoded['prerequisites']['prerequisites']);
                DB::table('prerequisites')->insert($prerequisitesData);

                // Insert courses
                if (!isset($decoded['courses']['courses'])) {
                    throw new \Exception('Missing "courses" key in courses.json');
                }
                $coursesData = array_map(function ($course) use ($decoded) {
                    return [
                        'roadmap_id' => (int) $decoded['courses']['roadmap_id'],
                        'candidate_id' => (int) $decoded['courses']['candidate_id'],
                        'id' => (int) $course['id'],
                        'name' => $course['name'],
                        'provider' => $course['provider'],
                        'link' => $course['link'],
                        'duration' => $course['duration'],
                        'completed' => (bool) $course['completed'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }, $decoded['courses']['courses']);
                DB::table('candidate_courses')->insert($coursesData);

                // Insert skills
                if (!isset($decoded['skills']['java'])) {
                    throw new \Exception('Missing "java" key in skills.json');
                }
                $skillsData = array_map(function ($skill) use ($decoded) {
                    return [
                        'roadmap_id' => (int) $decoded['skills']['roadmap_id'],
                        'candidate_id' => (int) $decoded['skills']['candidate_id'],
                        'id' => (int) $skill['id'],
                        'text' => $skill['text'],
                        'completed' => (bool) $skill['completed'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }, $decoded['skills']['java']);
                DB::table('roadmap_skills')->insert($skillsData);

                // Insert tools
                if (!isset($decoded['tools']['tools'])) {
                    throw new \Exception('Missing "tools" key in tools.json');
                }

                $toolsData = [];
                $toolSkillsData = [];

                foreach ($decoded['tools']['tools'] as $tool) {
                    // Données pour la table tools
                    $toolsData[] = [
                        'roadmap_id' => (int) $decoded['tools']['roadmap_id'],
                        'candidate_id' => (int) $decoded['tools']['candidate_id'],
                        'id' => (int) $tool['id'],
                        'name' => $tool['name'],
                        'description' => $tool['description'] ?? null,
                        'link' => $tool['link'] ?? null,
                        'image' => $tool['image'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    // Données pour la table tool_skills
                    if (!empty($tool['skills']) && is_array($tool['skills'])) {
                        foreach ($tool['skills'] as $skillText) {
                            $toolSkillsData[] = [
                                'tool_id' => (int) $tool['id'],
                                'skill' => $skillText,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }
                    }
                }

                DB::table('tools')->insert($toolsData);

                if (!empty($toolSkillsData)) {
                    DB::table('tool_skills')->insert($toolSkillsData);
                }

            });


        // Get all candidates
        $candidates = Candidate::all();

        if ($candidates->count() > 0) {
            // Define available platforms
            $platforms = ['facebook', 'twitter', 'discord', 'linkedin', 'github'];

            // Create social media profiles for each candidate
            foreach ($candidates as $candidate) {
                // For each candidate, we'll create between 1-5 social media links
                $numLinks = rand(1, 5);

                // Shuffle platforms to get random selection
                shuffle($platforms);

                // Create social links for randomly selected platforms
                for ($i = 0; $i < $numLinks; $i++) {
                    SocialMedia::factory()
                        ->forPlatform($platforms[$i])
                        ->create([
                            'candidate_id' => $candidate->id
                        ]);
                }
            }
        } else {
            // If no candidates exist, create some with social media profiles
            for ($i = 0; $i < 10; $i++) {
                $candidate = Candidate::factory()->create();

                // For each platform, 50% chance to create a profile
                foreach (['facebook', 'twitter', 'discord', 'linkedin', 'github'] as $platform) {
                    if (rand(0, 1)) {
                        SocialMedia::factory()
                            ->forPlatform($platform)
                            ->create([
                                'candidate_id' => $candidate->id
                            ]);
                    }
                }
            }

        }
    }
}

