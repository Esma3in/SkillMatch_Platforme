<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Test;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Result>
 */
class ResultFactory extends Factory
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
            'test_id'=>Test::factory(),
            'score'=>fake()->numberBetween('10','90'),
            'correctAnswer'=>fake()->sentence(),
            'candidateAnswer'=>fake()->sentence()
            ];
    }
}
