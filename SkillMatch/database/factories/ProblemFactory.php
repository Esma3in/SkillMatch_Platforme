<?php

namespace Database\Factories;

use App\Models\Skill;
use App\Models\Candidate;
use App\Models\Administrator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Problem>
 */
class ProblemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array

    {
        $tags = [
            'Algorithmics' ,
            'Mathematics',
            'Data structure',
            'Graphs'
        ];
        $levels= [
            'easy',
            'meduim',
            'hard',
            'expert'

        ];
        return [
            'name'=>fake()->sentence(),
            'description'=>fake()->paragraph(10),
            'figure'=>fake()->imageUrl(),
            'tags'=>fake()->randomElement($tags),
            'level'=>fake()->randomElement($levels),
            'example'=>fake()->text(),
            'inputFormat'=>fake()->text(10000),
            'outputFormat'=>fake()->text(100),
            'skill_id'=>Skill::factory(),
            'administrator_id'=>Administrator::factory(),
            'candidate_id'=>Candidate::factory()
        ];
    }
}
