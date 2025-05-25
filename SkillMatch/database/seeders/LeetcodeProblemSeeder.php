<?php

namespace Database\Seeders;

use App\Models\LeetcodeProblem;
use App\Models\Skill;
use App\Models\User;
use App\Models\Challenge;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class LeetcodeProblemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Path to the JSON file
        $jsonPath = database_path('data/json/leetcode_problems.json');

        // If the directory doesn't exist, create it
        if (!File::exists(database_path('data/json'))) {
            File::makeDirectory(database_path('data/json'), 0755, true);
        }

        // If the file doesn't exist yet, create it with example problems
        if (!File::exists($jsonPath)) {
            // Copy the example problems from the attached JSON file
            $problems = $this->getExampleProblems();
            File::put($jsonPath, json_encode($problems, JSON_PRETTY_PRINT));
        }

        // Read the JSON file
        $problemsJson = File::get($jsonPath);
        $problems = json_decode($problemsJson, true);

        if (!$problems) {
            $this->command->error("Failed to decode problems JSON or file is empty");
            return;
        }

        // Process each problem
        foreach ($problems as $problemData) {
            // Find or create related models
            $skillId = $problemData['skill_id'] ?? 1;
            $skill = Skill::find($skillId) ?? Skill::first();

            if (!$skill) {
                $skill = Skill::create(['name' => 'General', 'description' => 'General programming skills']);
            }

            $challengeId = null;
            if (!empty($problemData['challenge_id'])) {
                $challenge = Challenge::find($problemData['challenge_id']);
                $challengeId = $challenge ? $challenge->id : null;
            }

            $creatorId = $problemData['creator_id'] ?? 1;
            $creator = User::find($creatorId) ?? User::first();

            if (!$creator) {
                $creator = User::create([
                    'name' => 'Admin',
                    'email' => 'admin@example.com',
                    'password' => bcrypt('password'),
                    'role' => 'admin'
                ]);
            }

            // Create the problem
            LeetcodeProblem::updateOrCreate(
                ['title' => $problemData['title']],
                [
                    'description' => $problemData['description'],
                    'constraints' => $problemData['constraints'] ?? null,
                    'examples' => $problemData['examples'] ?? [],
                    'difficulty' => $problemData['difficulty'] ?? 'easy',
                    'test_cases' => $problemData['test_cases'] ?? [],
                    'starter_code' => $problemData['starter_code'] ?? [
                        'javascript' => "function solution() {\n  // Your code here\n}",
                        'python' => "def solution():\n    # Your code here\n    pass",
                        'java' => "class Solution {\n    public void solution() {\n        // Your code here\n    }\n}",
                        'php' => "function solution() {\n    // Your code here\n}"
                    ],
                    'solution_code' => $problemData['solution_code'] ?? null,
                    'skill_id' => $skill->id,
                    'challenge_id' => $challengeId,
                    'creator_id' => $creator->id,
                ]
            );
        }

        $this->command->info('Leetcode problems seeded successfully.');
    }

    /**
     * Get example problems in case the JSON file doesn't exist
     */
    private function getExampleProblems()
    {
        return [
            [
                "id" => 1,
                "title" => "Two Sum",
                "description" => "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                "constraints" => "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
                "examples" => [
                    ["input" => "nums = [2,7,11,15], target = 9", "output" => "[0,1]"],
                    ["input" => "nums = [3,2,4], target = 6", "output" => "[1,2]"]
                ],
                "difficulty" => "easy",
                "test_cases" => [
                    ["input" => [2, 7, 11, 15], "target" => 9, "expected_output" => [0, 1]],
                    ["input" => [3, 2, 4], "target" => 6, "expected_output" => [1, 2]]
                ],
                "starter_code" => [
                    "javascript" => "function twoSum(nums, target) {\n  // Your code here\n}",
                    "python" => "def two_sum(nums, target):\n    # Your code here\n    pass",
                    "java" => "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[0];\n    }\n}",
                    "php" => "function twoSum(\$nums, \$target) {\n    // Your code here\n}"
                ],
                "solution_code" => [
                    "javascript" => "function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) {\n      return [map[complement], i];\n    }\n    map[nums[i]] = i;\n  }\n  return [];\n}",
                    "python" => "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []"
                ],
                "skill_id" => 1,
                "challenge_id" => null,
                "creator_id" => 1
            ]
        ];
    }
}
