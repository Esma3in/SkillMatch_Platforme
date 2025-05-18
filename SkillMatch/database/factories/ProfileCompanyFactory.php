<?php

namespace Database\Factories;

use App\Models\ProfileCompany;
use App\Models\Company;
use App\Models\Candidate;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileCompanyFactory extends Factory
{
    protected $model = ProfileCompany::class;

    public function definition(): array
    {
        return [
            'serieNumber'    => $this->faker->unique()->numerify('SN-#######'),
            'reasonSocial'   => $this->faker->company,
            'address'        => $this->faker->address,
            'phone'          => $this->faker->phoneNumber,
            'capital'        => $this->faker->numberBetween(10000, 1000000),
            'salesfigures'   => $this->faker->numberBetween(50000, 5000000),
            'nbEmployers'    => $this->faker->numberBetween(10, 500),
            'DateCreation'   => $this->faker->date(),            
            // Foreign Keys
            'company_id'     => Company::inRandomOrder()->first()?->id ?? Company::factory(),
        ];
    }
}
