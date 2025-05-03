<?php

namespace Database\Factories;

use App\Models\Skill;
use App\Models\Roadmap;
use App\Models\RoadmapSkill;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoadmapSkillFactory extends Factory
{
    protected $model = RoadmapSkill::class;

    public function definition(): array
    {
        return [
            'roadmap_id' => Roadmap::inRandomOrder()->first()->id, // prendre un ID existant
            'skill_id'   => Skill::inRandomOrder()->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
