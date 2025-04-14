<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Serie_Challenge;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attestation>
 */
class AttestationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => substr(fake()->paragraph(),0,255),
            'signature' => fake()->imageUrl(),
            'candidate_id' => Candidate::factory(),
            'series_challenge_id' => Serie_Challenge::factory(),
        ];
    }
}
