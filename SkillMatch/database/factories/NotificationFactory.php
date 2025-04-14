<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'message'=>fake()->paragraph(4),
            'dateEnvoi'=>fake()->dateTimeBetween('-1 month','now'),
            'destinatiare'=>fake()->name(),
            'company_id'=>Company::factory(),
            'candidate_id'=>Candidate::factory()
        ];
    }
}
