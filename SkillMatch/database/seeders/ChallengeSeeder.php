<?php

namespace Database\Seeders;

use App\Models\Challenge;
use App\Models\Problem;
use App\Models\Skill;
use Illuminate\Database\Seeder;

class ChallengeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all available skills
        $skills = Skill::all();
        if ($skills->isEmpty()) {
            $this->command->info('No skills found. Please run SkillSeeder first.');
            return;
        }

        // Create challenges for each skill
        foreach ($skills as $skill) {
            // Create challenges with different difficulty levels
            $levels = ['beginner', 'easy', 'medium', 'intermediate', 'hard', 'advanced', 'expert'];

            foreach ($levels as $level) {
                // Create 1-2 challenges per skill and level
                $numChallenges = rand(1, 2);

                for ($i = 0; $i < $numChallenges; $i++) {
                    $challenge = Challenge::create([
                        'name' => $this->generateChallengeName($skill->name, $level, $i),
                        'description' => $this->generateChallengeDescription($skill->name, $level),
                        'level' => $level,
                        'skill_id' => $skill->id,
                    ]);

                    // Get problems with the same skill and level
                    $problems = Problem::where('skill_id', $skill->id)
                        ->where('level', $level)
                        ->inRandomOrder()
                        ->limit(rand(3, 5)) // 3-5 problems per challenge
                        ->get();

                    // If not enough problems with exact match, get problems with the same skill
                    if ($problems->count() < 3) {
                        $problems = Problem::where('skill_id', $skill->id)
                            ->inRandomOrder()
                            ->limit(rand(3, 5))
                            ->get();
                    }

                    // If still not enough, get random problems
                    if ($problems->count() < 3) {
                        $problems = Problem::inRandomOrder()
                            ->limit(rand(3, 5))
                            ->get();
                    }

                    // Attach problems with order
                    $problemOrder = [];
                    foreach ($problems as $index => $problem) {
                        $problemOrder[$problem->id] = ['order' => $index];
                    }

                    $challenge->problems()->attach($problemOrder);

                    $this->command->info("Created challenge: {$challenge->name} with {$problems->count()} problems");
                }
            }
        }
    }

    /**
     * Generate a challenge name based on skill and level
     */
    private function generateChallengeName($skillName, $level, $index)
    {
        $prefixes = [
            'beginner' => ['Introduction to', 'Getting Started with', 'Basics of'],
            'easy' => ['Fundamentals of', 'Essential', 'Core'],
            'medium' => ['Practical', 'Applied', 'Effective'],
            'intermediate' => ['Intermediate', 'Progressive', 'Enhanced'],
            'hard' => ['Advanced', 'Complex', 'Challenging'],
            'advanced' => ['Professional', 'Expert-Level', 'Specialized'],
            'expert' => ['Master', 'Elite', 'Ultimate']
        ];

        $suffixes = [
            'beginner' => ['for Beginners', 'Fundamentals', 'Basics'],
            'easy' => ['Essentials', 'Foundations', 'Core Concepts'],
            'medium' => ['Techniques', 'Applications', 'Methods'],
            'intermediate' => ['Proficiency', 'Advancement', 'Development'],
            'hard' => ['Mastery', 'Excellence', 'Expertise'],
            'advanced' => ['Specialization', 'Professionalism', 'Mastery'],
            'expert' => ['Mastery Challenge', 'Elite Series', 'Championship']
        ];

        $prefix = $prefixes[$level][array_rand($prefixes[$level])];
        $suffix = $suffixes[$level][array_rand($suffixes[$level])];

        if ($index > 0) {
            return "{$prefix} {$skillName} {$suffix} " . ($index + 1);
        }

        return "{$prefix} {$skillName} {$suffix}";
    }

    /**
     * Generate a challenge description based on skill and level
     */
    private function generateChallengeDescription($skillName, $level)
    {
        $descriptions = [
            'beginner' => [
                "Start your journey into {$skillName} with this introductory challenge. Perfect for beginners who want to build a solid foundation.",
                "Learn the basics of {$skillName} through a series of simple problems designed to introduce core concepts.",
                "A gentle introduction to {$skillName} for those just starting out. Build confidence with these entry-level problems."
            ],
            'easy' => [
                "Strengthen your fundamental knowledge of {$skillName} with this easy challenge. Ideal for those with basic understanding.",
                "Develop essential {$skillName} skills through these accessible problems that build on basic concepts.",
                "Enhance your {$skillName} foundations with this approachable challenge designed to reinforce key principles."
            ],
            'medium' => [
                "Take your {$skillName} skills to the next level with this medium-difficulty challenge. Apply core concepts to solve practical problems.",
                "Expand your {$skillName} expertise through these moderately challenging problems that test your understanding.",
                "Build practical {$skillName} experience with this medium-level challenge that bridges theory and application."
            ],
            'intermediate' => [
                "Push your {$skillName} knowledge further with this intermediate challenge. Solve problems that require deeper understanding.",
                "Advance your {$skillName} proficiency through these intermediate problems that test your analytical thinking.",
                "Strengthen your {$skillName} capabilities with this intermediate challenge designed for those with solid experience."
            ],
            'hard' => [
                "Test your advanced {$skillName} skills with this challenging series of problems. Recommended for experienced practitioners.",
                "Tackle complex {$skillName} problems in this hard challenge that will push your technical abilities.",
                "Demonstrate your {$skillName} expertise by solving these difficult problems that require advanced knowledge."
            ],
            'advanced' => [
                "Showcase your professional-level {$skillName} abilities with this advanced challenge. For those with significant experience.",
                "Solve sophisticated {$skillName} problems in this advanced challenge designed for seasoned professionals.",
                "Prove your advanced {$skillName} mastery through these complex problems that require specialized knowledge."
            ],
            'expert' => [
                "The ultimate test of {$skillName} mastery. This expert challenge presents the most difficult problems for elite practitioners.",
                "Demonstrate world-class {$skillName} expertise by conquering these extremely challenging problems.",
                "Push the boundaries of your {$skillName} knowledge with this expert-level challenge designed for the very best."
            ]
        ];

        return $descriptions[$level][array_rand($descriptions[$level])];
    }
}
