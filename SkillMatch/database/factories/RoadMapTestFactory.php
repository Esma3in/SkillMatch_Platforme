<?php

namespace Database\Factories;

use App\Models\Roadmap;
use App\Models\Candidate;
use App\Models\RoadMapTest;
use App\Models\RoadMap_Test;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RoadMap_Test>
 */
class RoadMapTestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'roadmap_id' => Roadmap::factory(),
            'title' => fake()->sentence(3),
            'description' => substr(fake()->paragraph(),0,255),
            'total_score' => fake()->numberBetween(0, 100),
            'start_date' => fake()->dateTimeBetween('-1 month', 'now'),
            'end_date' => fake()->dateTimeBetween('now', '+1 month'),
        ];
    }
    //des candidats associés dans un test de la roadmap
    public function withCandidates(int $count = 3): self
    {
        return $this->afterCreating(function (RoadMapTest $roadMapTest) use ($count) {
            $candidates = Candidate::factory($count)->create();
            $roadMapTest->candidates()->attach($candidates, [
                'score' => $this->faker->numberBetween(0, 100),
                'status' => $this->faker->randomElement(['pending', 'completed', 'failed']),
                'passed_at' => $this->faker->dateTimeThisYear()
            ]);
        });
    }
}
