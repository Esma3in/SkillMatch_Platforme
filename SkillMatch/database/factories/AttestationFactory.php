<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\SerieChallenge;
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
            'series_challenge_id' => SerieChallenge::factory(),
        ];
    }
}
