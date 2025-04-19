<?php

namespace Database\Factories;

use App\Models\Skill;
use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CandidatesSkills>
 */
class CandidatesSkillsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'candidate_id'=>Candidate::factory(),
            'skill_id'=>Skill::factory(),
        ];
    }
}
