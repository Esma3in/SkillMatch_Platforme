<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User ;

/**
<<<<<<<< HEAD:SkillMatch/database/factories/CandidateFactory.php
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Candidate>
 */
class CandidateFactory extends Factory
========
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Serie_Challenge>
 */
class Serie_ChallengeFactory extends Factory
>>>>>>>> 3cf2cfaf55f0fd0d58a1b907f79a51450a9fc90d:SkillMatch/database/factories/Serie_ChallengeFactory.php
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
<<<<<<<< HEAD:SkillMatch/database/factories/CandidateFactory.php
            'name' => fake()->name,
            'dateInscription' => fake()->date(),
            'fichiers' => fake()->filePath(),
            'utilisateur_id' => User::factory(),
========
            'name' => fake()->neme(),
            'challenge' => substr(fake()->paragraph(),0,255), 
            'number' => fake()->numberBetween(1, 100),
>>>>>>>> 3cf2cfaf55f0fd0d58a1b907f79a51450a9fc90d:SkillMatch/database/factories/Serie_ChallengeFactory.php
        ];
    }
}
