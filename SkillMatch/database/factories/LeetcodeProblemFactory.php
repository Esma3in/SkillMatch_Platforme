<?php

namespace Database\Factories;

use App\Models\Skill;
use App\Models\User;
use App\Models\Challenge;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LeetcodeProblem>
 */
class LeetcodeProblemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $difficulties = ['easy', 'medium', 'hard'];

        return [
            'title' => 'Problem: ' . $this->faker->unique()->words(3, true),
            'description' => $this->faker->paragraphs(3, true),
            'constraints' => $this->faker->paragraph(),
            'examples' => [
                [
                    'input' => 'nums = [2, 7, 11, 15], target = 9',
                    'output' => '[0, 1]',
                    'explanation' => 'Because nums[0] + nums[1] == 9, we return [0, 1].'
                ],
                [
                    'input' => 'nums = [3, 2, 4], target = 6',
                    'output' => '[1, 2]',
                    'explanation' => 'Because nums[1] + nums[2] == 6, we return [1, 2].'
                ]
            ],
            'difficulty' => $this->faker->randomElement($difficulties),
            'test_cases' => [
                ['input' => '[2,7,11,15]', 'expected' => '[0,1]'],
                ['input' => '[3,2,4]', 'expected' => '[1,2]'],
                ['input' => '[3,3]', 'expected' => '[0,1]']
            ],
            'starter_code' => [
                'javascript' => "function solution(nums, target) {\n  // Your code here\n}",
                'python' => "def solution(nums, target):\n    # Your code here\n    pass",
                'java' => "class Solution {\n    public int[] solution(int[] nums, int target) {\n        // Your code here\n        return new int[2];\n    }\n}",
                'php' => "function solution(array \$nums, int \$target) {\n    // Your code here\n}"
            ],
            'solution_code' => [
                'javascript' => "function solution(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
                'python' => "def solution(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
                'java' => "class Solution {\n    public int[] solution(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}",
                'php' => "function solution(array \$nums, int \$target) {\n    \$map = [];\n    foreach (\$nums as \$i => \$num) {\n        \$complement = \$target - \$num;\n        if (isset(\$map[\$complement])) {\n            return [\$map[\$complement], \$i];\n        }\n        \$map[\$num] = \$i;\n    }\n    return [];\n}"
            ],
            'skill_id' => function () {
                return Skill::inRandomOrder()->first()->id ?? Skill::factory()->create()->id;
            },
            'challenge_id' => function () {
                return Challenge::inRandomOrder()->first()->id ?? null;
            },
            'creator_id' => function () {
                return User::inRandomOrder()->first()->id ?? User::factory()->create()->id;
            },
        ];
    }
}
