<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\SocialMedia;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SocialMedia>
 */
class SocialMediaFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SocialMedia::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $platforms = ['facebook', 'twitter', 'discord', 'linkedin', 'github'];
        $platform = $this->faker->randomElement($platforms);

        return [
            'candidate_id' => Candidate::factory(),
            'platform' => $platform,
            'url' => $this->generateFakeSocialUrl($platform),
        ];
    }

    /**
     * Generate a realistic-looking social media URL based on platform
     *
     * @param string $platform
     * @return string
     */
    private function generateFakeSocialUrl(string $platform): string
    {
        $username = $this->faker->userName();

        switch ($platform) {
            case 'facebook':
                return $username;
            case 'twitter':
                return $username;
            case 'discord':
                return $username . '#' . $this->faker->numerify('####');
            case 'linkedin':
                return $username;
            case 'github':
                return $username;
            default:
                return $username;
        }
    }

    /**
     * Configure the model factory for a specific platform.
     *
     * @param string $platform
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function forPlatform(string $platform)
    {
        return $this->state(function () use ($platform) {
            return [
                'platform' => $platform,
                'url' => $this->generateFakeSocialUrl($platform),
            ];
        });
    }
}
