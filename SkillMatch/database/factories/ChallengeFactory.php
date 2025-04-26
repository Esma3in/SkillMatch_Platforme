<?php

namespace Database\Factories;

use App\Models\Challenge;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChallengeFactory extends Factory
{
    protected $model = Challenge::class;

    public function definition()
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'level' => $this->faker->randomElement(['easy','meduim','hard','expert']),
            'skill_id' => Skill::factory(),
        ];
    }
}
