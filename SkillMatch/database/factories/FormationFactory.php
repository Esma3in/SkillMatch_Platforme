<?php

namespace Database\Factories;

use App\Models\ProfileCandidate;
use App\Models\Profile_candidate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Formation>
 */
class FormationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fields = [
            "Computer Science",
            "Software Engineering",
            "Information Technology (IT)",
            "Web Development",
            "Mobile App Development",
            "Game Development",
            "Digital Design",
            "Multimedia Design",
            "Human-Computer Interaction (HCI)",
            "3D Modeling and Animation",
            "Cybersecurity",
            "Data Science & Big Data",
            "Artificial Intelligence & Machine Learning",
            "Cloud Computing",
            "DevOps",
            "Digital Forensics",
            "Digital Marketing",
            "Digital Media & Communications",
            "E-learning & Educational Tech",
            "Digital Sociology / Humanities"
        ];
        return [
        'candidate_profile_id'=>ProfileCandidate::factory(),
        'institution_name'=>fake()->company(),
        'degree'=>$this->faker->randomFloat(2,12,19),
        'start_date'=>fake()->dateTimeBetween('-11 years','-7 years'),
        'end_date'=>fake()->dateTimeBetween('-9 years','-4 years'),
        'field_of_study'=>$this->faker->randomElement($fields)
        ];
    }
}
