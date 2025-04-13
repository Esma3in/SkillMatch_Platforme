<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
        public function definition()
        {
            $companySectors = [
                'Technologie',
                'Santé',
                'Finance',
                'Éducation',
                'Construction',
                'Transport',
                'Tourisme',
                'Agroalimentaire',
                'Énergie',
                'Immobilier',
                'Télécommunications',
                'Assurance',
                'Textile',
                'Automobile',
                'Pharmaceutique',
                'Aéronautique',
                'Informatique',
                'Marketing',
                'Logistique',
                'Mode',
            ];
            
            return [
                'nom' => fake()->company(),
                'secteur' => fake()->randomElement($companySectors),
                'fichiers' => fake()->boolean(40),
            ];
        }
}
