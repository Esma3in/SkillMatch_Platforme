<?php

namespace Database\Factories;

use App\Models\Profile_candidate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Experience>
 */
class ExperienceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'candidate_profile_id'=>Profile_candidate::factory(),
            'title'=>fake()->sentence(7),
            'company_name'=>fake()->company(),
            'start_date'=>fake()->dateTimeBetween('-7 years','-5 years'),
            'end_date'=>fake()->dateTimeBetween('-4 years','-5 months'),
            'description'=>fake()->paragraph('7')

        ];
    }
}
