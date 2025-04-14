<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User ;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Candidate>
 */

class Serie_ChallengeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => fake()->name(),
            'dateInscription' => fake()->date(),
            'fichiers' => fake()->filePath(),
            'utilisateur_id' => User::factory(),
            'challenge' => substr(fake()->paragraph(),0,255),
            'number' => fake()->numberBetween(1, 9999),
        ];
    }
}
