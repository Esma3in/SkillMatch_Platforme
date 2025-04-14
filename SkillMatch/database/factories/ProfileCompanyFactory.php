<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company ;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile_company>
 */
class ProfileCompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'siret' => fake()->numberBetween(12345789,987654321),
            'raisonSociale' => fake()->company,
            'secteurActivite' => fake()->randomElement(['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail']),
            'adresse' => fake()->address,
            'telephone' => fake()->phoneNumber,
            'email' => fake()->unique()->companyEmail,
            'siteweb' => fake()->url,
            'capital' => fake()->numberBetween(10000, 10000000),
            'chiffreAffaires' => fake()->numberBetween(50000, 50000000),
            'nombreEmployes' => fake()->numberBetween(10, 1000),
            'dateCreation' => fake()->date(),
            'statut' => fake()->randomElement(['active', 'inactive', 'pending']),
            'competencesList' => json_encode(fake()->words(5)),
            'entreprise_id' => Company::factory(),
        ];
    }
}
