<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Roadmap>
 */
class RoadmapFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
<<<<<<< HEAD:SkillMatch/database/factories/AdministratorFactory.php
    public function definition()
    {
        return [
            'user_id' => User::factory(),
=======
    public function definition(): array
    {
        return [
             'skill_id'=>Skill::factory(),
             'candidate_id'=>Candidate::factory()
>>>>>>> 3cf2cfaf55f0fd0d58a1b907f79a51450a9fc90d:SkillMatch/database/factories/RoadmapFactory.php
        ];
    }
}
