<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompanyLegalDocuments>
 */
class CompanyLegalDocumentsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $numDescriptionPoints = rand(2, 4);
        $descriptionPoints = [];

        for ($i = 0; $i < $numDescriptionPoints; $i++) {
            $descriptionPoints[] = $this->faker->sentence(mt_rand(6, 12));
        }

        return [
            'company_id' => Company::factory(),
            'title' => $this->faker->words(3, true), // Example: "Legal Compliance Agreement"
            'descriptions' => $descriptionPoints, // Cast to array, will be saved as JSON
        ];
    }
}
