<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User ;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'nom' => fake()->company,
            'secteur' => fake()->randomElement(['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail']),
            'fichiers' => fake()->filePath(),
            'utilisateur_id' => User::factory(),
        ];
    }
}
