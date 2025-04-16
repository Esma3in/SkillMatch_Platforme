<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Test>
 */
class TestFactory extends Factory
{
    
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         $difficulteTable=['Easy','Medium','Hard'];
        return [
            'description'=>fake()->paragraph(3),
            'difficulte'=>$this->faker->randomElement($difficulteTable),
            'evaluation'=>$this->faker->randomNumber(5,10),
            'company_id'=>Company::factory(),
        ];
    }
}
