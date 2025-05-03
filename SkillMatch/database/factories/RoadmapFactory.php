<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Roadmap>
 */
class RoadmapFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $completed = [
            'completed',
            'pending', 
            'canceled'

        ];
        return [
             'skill_id'=>Skill::factory(),
             'name'=>fake()->domainName(),
             'completed'=>fake()->randomElement($completed),
             'candidate_id'=>Candidate::factory()
        ];
    }

}
