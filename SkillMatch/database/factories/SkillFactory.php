<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Company;
use App\Models\Test;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Skill>
 */
class SkillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $levels= [
            'easy',
            'meduim',
            'hard',
            'expert'

        ];
        $type=[
            'Urgent and important',
            'Important',
            'valuable',
            'secondaire',
            'basics'

        ];
        $usageFrequency=[
            'Daily',
            'Weekly',
            'Monthly',
            'Annual'
        ];
        $classement=[
            'junior',
            'technicien',
            'engienner',
            'scrum master',
            'product owner'
        ];
        $skills = [
            // Languages
            'Java', 'JavaScript', 'Python', 'C#', 'C++', 'PHP', 'Go', 'Ruby', 'Swift', 'Kotlin', 'TypeScript',
            // Frontend frameworks
            'React', 'Vue.js', 'Angular', 'Svelte', 'Alpine.js',
            // Backend frameworks
            'Laravel', 'Symfony', 'Express.js', 'Spring Boot', 'Django', 'Flask', 'Rails', 'ASP.NET Core',
            // Mobile frameworks
            'React Native', 'Flutter', 'Ionic', 'Xamarin',
            // DevOps / Tools
            'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Jenkins', 'GitHub Actions',
            // Testing
            'Jest', 'Mocha', 'PHPUnit', 'Cypress', 'Selenium',
            // Database / Data
            'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Redis', 'GraphQL',
            // Cloud
            'AWS', 'Azure', 'Google Cloud Platform'
        ];


        return [
            'name' => fake()->randomElement($skills),
            'level'=>fake()->randomElement($levels),
            'type' =>fake()->randomElement($type),
            'usageFrequency' =>fake()->randomElement($usageFrequency),
             'classement'=> fake()->randomElement($classement),
              'test_id'=>Test::factory()
        ];
    }
}
