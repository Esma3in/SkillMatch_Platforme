<?php

namespace Database\Factories;

use App\Models\Profile_candidate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types_documents=['CV',
                'Cover Letter',
                'ID Document',
                'Certificate'];
        return [
            'candidate_profile_id'=>Profile_candidate::factory(),
            'document_type'=>$this->faker->randomElement($types_documents),
            'file_path'=>'Documents/'.$this->faker->uuid.'pdf',
        ];
    }
}
