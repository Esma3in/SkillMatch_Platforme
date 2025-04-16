<?php

namespace Database\Factories;

use App\Models\ProfileCompany;
use Illuminate\Database\Eloquent\Factories\Factory;

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
    public function definition(): array
    {
        $sectors = [
            'Information Technology',
            'Healthcare',
            'Finance',
            'Education',
            'Retail',
            'Manufacturing',
            'Transportation & Logistics',
            'Construction',
            'Real Estate',
            'Telecommunications',
            'Energy & Utilities',
            'Agriculture',
            'Automotive',
            'Entertainment & Media',
            'Legal Services',
            'Hospitality & Tourism',
            'Food & Beverage',
            'Marketing & Advertising',
            'Pharmaceuticals',
            'Non-profit & NGO',
        ];
        return [
            'name'=>fake()->company(),
            'sector'=>fake()->randomElement($sectors),
            'files'=>fake()->optional()->word().'pdf',
        ];
    }
}
