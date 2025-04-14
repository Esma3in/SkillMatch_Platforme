<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $role = [
            'candidate',
            'company',
            'administrator'
        ];
        return [
            'email' => fake()->unique()->safeEmail,
            'password' => Hash::make('123456'),
            'role' => fake()->randomElement($role),
        ];
    }
}
