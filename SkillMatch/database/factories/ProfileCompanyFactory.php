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
            'websiteUrl'   => $this->faker->url(),
            'address'        => $this->faker->address,
            'phone'          => $this->faker->phoneNumber,
            'Bio'    => $this->faker->paragraph(7),
            'DateCreation'   => $this->faker->date(),            
            // Foreign Keys
            'company_id'     => Company::inRandomOrder()->first()?->id ?? Company::factory(),
        ];
    }
}
