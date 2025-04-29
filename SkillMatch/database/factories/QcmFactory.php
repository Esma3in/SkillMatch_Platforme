<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Qcm>
 */
class QcmFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'question'=>fake()->sentence().'?',
            'option_a'=>fake()->sentence(),
            'option_b'=>fake()->sentence(),
            'option_c'=>fake()->sentence(),
            'option_d'=>fake()->sentence(),
            'corrected_option'=>fake()->sentence()
        ];
    }
}
