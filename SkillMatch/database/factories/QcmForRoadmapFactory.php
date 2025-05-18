<?php

namespace Database\Factories;

use App\Models\Roadmap;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

class QcmForRoadmapFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        // Generate 3-4 random options, ensuring one matches the correct answer
        $options = [
            $this->faker->sentence(),
            $this->faker->sentence(),
            $this->faker->sentence(),
            $this->faker->optional(0.3)->sentence() // 30% chance of 4 options
        ];
        $correctAnswer = fake()->randomElement($options); // Randomly select one option as correct
        $options = array_filter($options); // Remove any null entries from optional generation
        $options = json_encode(array_values($options)); // Convert to JSON array

        return [
            'question' => $this->faker->sentence(),
            'options' => $options,
            'correct_answer' => $correctAnswer,
            'skill_id' => Skill::factory(),
            "roadmap_id" => Roadmap::factory()
        ];
    }
}