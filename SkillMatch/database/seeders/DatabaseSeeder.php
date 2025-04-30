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
        
            $data = [];
            $decoded = [];
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
        
            // Validate prerequisites
            $skillNames = [];
            foreach ($decoded['prerequisites'] as $roadmap) {
                if (!isset($roadmap['prerequisites'])) {
                    throw new \Exception('Missing "prerequisites" key in prerequisites.json roadmap entry');
                }
                foreach ($roadmap['prerequisites'] as $prereq) {
                    if (!isset($prereq['skills'][0]['name'])) {
                        throw new \Exception('Missing skill name in prerequisites.json');
                    }
                    $skillNames[] = $prereq['skills'][0]['name'];
                }
            }
            $skillNames = array_unique($skillNames);
        
            // Check if skill names exist and map to skill_ids
            $skillMap = DB::table('skills')->whereIn('name', $skillNames)->pluck('id', 'name')->toArray();
            $missingSkills = array_diff($skillNames, array_keys($skillMap));
      
        
            // Insert prerequisites
            $prerequisitesData = [];
            foreach ($decoded['prerequisites'] as $roadmap) {
                foreach ($roadmap['prerequisites'] as $prereq) {
                    $prerequisitesData[] = [
                        'skill_id' => (int) $skillMap[$prereq['skills'][0]['name']],
                        'text' => $prereq['text'],
                        'completed' => (bool) $prereq['completed'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            if (empty($prerequisitesData)) {
                throw new \Exception('No valid prerequisites found in prerequisites.json');
            }
            DB::table('prerequisites')->insert($prerequisitesData);
        
            // Insert courses
            if (!isset($decoded['courses']['courses'])) {
                throw new \Exception('Missing "courses" key in courses.json');
            }
            $coursesData = array_map(function ($course) {
                return [
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
        
            // Insert skills (unchanged)
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
        
            // Insert tools (unchanged)
            if (!isset($decoded['tools']['tools'])) {
                throw new \Exception('Missing "tools" key in tools.json');
            }
            $toolsData = array_map(function ($tool) use ($decoded) {
                return [
                    'roadmap_id' => (int) $decoded['tools']['roadmap_id'],
                    'candidate_id' => (int) $decoded['tools']['candidate_id'],
                    'id' => (int) $tool['id'],
                    'name' => $tool['name'],
                    'description' => $tool['description'],
                    'link' => $tool['link'],
                    'image' => $tool['image'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $decoded['tools']['tools']);
            DB::table('tools')->insert($toolsData);
        });
        }


    }

