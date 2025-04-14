<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Serie_Challenge>
 */
class Serie_ChallengeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->neme(),
            'challenge' => substr(fake()->paragraph(),0,255), 
            'number' => fake()->numberBetween(1, 100),
        ];
    }
}
