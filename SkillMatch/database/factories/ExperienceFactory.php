<?php

namespace Database\Factories;

use App\Models\ProfileCandidate;
use App\Models\Profile_candidate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Experience>
 */
class ExperienceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array

    {
        $location = [
            'Tetouan','Tanger','Rabat'
        ];
        $EmployementType = [
            'manager' ,'engineer' ,"specilised technical" , "stagiaire","project manager"
        ];
    
        return [
            'candidate_profile_id'=>ProfileCandidate::factory(),
            'experience'=>fake()->sentence(7),
            'location'=>fake()->randomElement($location),
            'employement_type' =>fake()->randomElement($EmployementType),
            'role' =>fake()->paragraph(),
            'start_date'=>fake()->dateTimeBetween('-7 years','-5 years'),
            'end_date'=>fake()->dateTimeBetween('-4 years','-5 months'),
            'description'=>fake()->paragraph('7')

        ];
    }
}
