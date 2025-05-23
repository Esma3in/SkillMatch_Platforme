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

        return [

            "roadmap_id" => Roadmap::factory()
        ];
    }
}