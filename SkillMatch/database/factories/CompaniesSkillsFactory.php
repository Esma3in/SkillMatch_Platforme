<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompaniesSkills>
 */
class CompaniesSkillsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id'=>Company::factory(),
            'skill_id'=>Skill::factory()
        ];
    }
}
