<?php

namespace Database\Seeders;

use App\Models\Ceo;
use App\Models\Step;
use App\Models\Test;
use App\Models\User;
use App\Models\Badge;

use App\Models\Skill;
use App\Models\Result;
use App\Models\Company;
use App\Models\Problem;
use App\Models\Roadmap;
use App\Models\Document;
use App\Models\Language;

use App\Models\Candidate;
use App\Models\Challenge;
use App\Models\Formation;
use App\Models\Experience;
use App\Models\Attestation;

use App\Models\RoadMapTest;
use App\Models\SocialMedia;
use App\Models\Notification;
use App\Models\RoadmapSkill;

use App\Models\Administrator;
use App\Models\ProfileCompany;
use App\Models\SerieChallenge;

use App\Models\CompaniesSkills;
use Illuminate\Database\Seeder;
use App\Models\CandidatesSkills;
use App\Models\ProfileCandidate;
use App\Models\CompaniesSelected;
use App\Models\CompanyLegalDocuments;
use App\Models\CompanyServices;
use App\Models\CandidateSelected;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;


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
        $levels = ['easy','medium','hard','expert'];
        $skillsCreated = [];
        foreach ($skills as $skillName) {
            $skillsCreated[] = Skill::factory()->create([
                'name' => $skillName,
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

        Administrator::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('Admin@12345'), // Strong default password
        ]);


        // Create Companies and their Profiles, Roadmaps, Challenges
       $companies=Company::factory(10)->create()->each(function ($company) use($skillsCreated) {
            CompanyServices::factory(2)->create([
                'company_id'=>$company->id,
            ]);
            CompanyLegalDocuments::factory()->create([
                'company_id'=>$company->id
            ]);
            CandidateSelected::factory(10)->create([
                'company_id'=>$company->id,
            ]);
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
            Attestation::factory(2)->create([
                'candidate_id' => $candidate->id
            ]);
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

            // Validate and insert prerequisites
            $skillNames = [];
            foreach ($decoded['prerequisites'] as $skillGroup) {
                if (!isset($skillGroup['skill']) || !isset($skillGroup['prerequisites'])) {
                    throw new \Exception('Missing "skill" or "prerequisites" key in prerequisites.json');
                }
                $skillNames[] = $skillGroup['skill'];
            }
            $skillNames = array_unique($skillNames);

            // Check if skill names exist and map to skill_ids
            $skillMap = DB::table('skills')->whereIn('name', $skillNames)->pluck('id', 'name')->toArray();

            // Insert prerequisites
            $prerequisitesData = [];
            foreach ($decoded['prerequisites'] as $skillGroup) {
                $skillName = $skillGroup['skill'];
                // if (!isset($skillMap[$skillName])) {
                //     throw new \Exception("Skill '$skillName' not found in skills table");
                // }
                $skillId = $skillMap[$skillName];
                foreach ($skillGroup['prerequisites'] as $prereq) {
                    $prerequisitesData[] = [
                        'skill_id' => $skillId,
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
            DB::table('prerequistes')->insert($prerequisitesData);

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

            // Insert skills
            if (empty($decoded['skills'])) {
                throw new \Exception('No skills found in skills.json');
            }
            $skillsData = [];
            foreach ($decoded['skills'] as $skillGroup) {
                foreach ($skillGroup as $skill) {
                    $skillsData[] = [
                        'id' => (int) $skill['id'],
                        'text' => $skill['text'],
                        'completed' => (bool) $skill['completed'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            if (empty($skillsData)) {
                throw new \Exception('No valid skills found in skills.json');
            }
            DB::table('roadmap_skills')->insert($skillsData);

            // Insert tools
            if (!isset($decoded['tools']['tools'])) {
                throw new \Exception('Missing "tools" key in tools.json');
            }
            $toolsData = [];
            $toolSkillsData = [];
            foreach ($decoded['tools']['tools'] as $tool) {
                $toolsData[] = [
                    'id' => (int) $tool['id'],
                    'name' => $tool['name'],
                    'description' => $tool['description'] ?? null,
                    'link' => $tool['link'] ?? null,
                    'image' => $tool['image'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
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


   // Create roadmaps and skills
   Roadmap::factory()->count(10)->create();
   Skill::factory()->count(10)->create();
   // Create roadmap-skill relationships
   RoadmapSkill::factory()->count(90)->create();

   // Path to the JSON file
   $qcmForRoadmap = database_path('data/json/QcmForRoadmap.json');

   // Check if the JSON file exists
   if (!File::exists($qcmForRoadmap)) {
       $this->command->error("JSON file not found at: $qcmForRoadmap");
       return;
   }

   // Load and decode the JSON file
   $qcmData = json_decode(File::get($qcmForRoadmap), true);

   // Get all roadmaps
   $roadmaps = Roadmap::all();

   foreach ($qcmData as $skillName => $questions) {
       // Find the skill by name
       $skill = Skill::where('name', $skillName)->first();

       if (!$skill) {
           $this->command->warn("Skill not found in database: $skillName");
           continue;
       }

       // For each roadmap, associate the questions
       foreach ($roadmaps as $roadmap) {
           foreach ($questions as $questionData) {
               DB::table('qcm_for_roadmaps')->insert([
                   'question' => $questionData['question'],
                   'options' => json_encode($questionData['options']),
                   'correct_answer' => $questionData['correctAnswer'],
                   'skill_id' => $skill->id,
                   'roadmap_id' => $roadmap->id,
                   'created_at' => now(),
                   'updated_at' => now(),
               ]);
           }
       }

       $this->command->info("QCM inserted for skill: $skillName across all roadmaps");
   }



        //1 candidate for filter company
        $user = User::create([
            'name' => 'chaimaeel',
            'email' => 'candidate9999999@example.com',
            'password' => Hash::make('password'),
            'role' => 'candidate'
        ]);
        $candidate = Candidate::create([
            'id' => 9999999,
            'user_id' => $user->id,
            'name' => 'Candidate 9999999',
            'email' => 'candidate9999999@example.com',
            'password' => Hash::make('password'),
            'state' => 'active'
        ]);

        // Ajout du profil
        $candidate->profile()->create([
            'field' => 'Web Development',
            'last_name' => 'Dev',
            'phoneNumber' => '0612345678',
            'file' => null,
            'projects' => null,
            'experience' => ['Stage à XYZ'],
            'formation' => ['Licence Informatique'],
            'photoProfil' => null,
            'localisation' => 'Tétouan, Morocco',
            'description' => 'Développeur web basé à Tétouan.',
            'competenceList' => ['HTML', 'CSS', 'JavaScript', 'Laravel']
        ]);


    }
}
