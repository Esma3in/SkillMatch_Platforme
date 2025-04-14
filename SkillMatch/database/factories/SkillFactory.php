<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Company;
use App\Models\Test;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Skill>
 */
class SkillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $levels= [
            'easy',
            'meduim',
            'hard',
            'expert'

        ];
        $type=[
            'Urgent and important',
            'Important',
            'valuable',
            'secondaire',
            'basics'

        ];
        $usageFrequency=[
            'Daily',
            'Weekly',
            'Monthly',
            'Annual'
        ];
        $classement=[
            'junior',
            'technicien',
            'engienner',
            'scrum master',
            'product owner'
        ];

        return [
            'name'=>fake()->name(),
            'level'=>fake()->randomElement($levels),
            'type' =>fake()->randomElement($type),
            'usageFrequency' =>fake()->randomElement($usageFrequency),
             'classement'=> fake()->randomElement($classement),
              'candidate_id'=>Candidate::factory(),
              'company_id' =>Company::factory(),
              'test_id'=>Test::factory()
        ];
    }
}
