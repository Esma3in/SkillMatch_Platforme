<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompaniesSelected>
 */
class CompaniesSelectedFactory extends Factory
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
            'company_id'=>Company::factory()
        ];
    }
}
