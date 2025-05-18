<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\companyServices>
 */
class CompanyServicesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $serviceTitles = [
            'Digital Transformation',
            'Application Development & Modernization',
            'IT Infrastructure Services',
            'Cloud Computing Solutions',
            'Data Analytics & Business Intelligence',
            'Cybersecurity Services',
            'Enterprise Software Solutions',
            'IT Consulting & Strategy'
        ];

        // Set a random number of description points (2-4)
        $numDescriptionPoints = rand(2, 4);
        $descriptionPoints = [];
        
        // Generate business service description points
        for ($i = 0; $i < $numDescriptionPoints; $i++) {
            $descriptionPoints[] = $this->faker->sentence(mt_rand(4, 8));
        }

        return [
            'company_id' => Company::factory(),
            'title' => $this->faker->randomElement($serviceTitles),
            'descriptions' => $descriptionPoints , // This is an array that will be JSON-encoded by Laravel
        ];
    }
}
