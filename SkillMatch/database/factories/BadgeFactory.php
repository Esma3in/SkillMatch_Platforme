<?php

namespace Database\Factories;

use App\Models\Roadmap;
use App\Models\Candidate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Badge>
 */
class BadgeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'icon' => fake()->imageUrl(64, 64, 'badges'),
            'Date_obtained' => fake()->dateTime(max:"now"),
            'roadmap_id' => Roadmap::factory(),
            'candidate_id' => Candidate::factory(),
        ];
    }
}
