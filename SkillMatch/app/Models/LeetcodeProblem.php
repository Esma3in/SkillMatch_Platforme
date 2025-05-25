<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeetcodeProblem extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'constraints',
        'examples',
        'difficulty',
        'test_cases',
        'starter_code',
        'solution_code',
        'skill_id',
        'challenge_id',
        'creator_id'
    ];

    protected $casts = [
        'examples' => 'array',
        'test_cases' => 'array',
        'starter_code' => 'array',
        'solution_code' => 'array',
    ];

    /**
     * Get the skill associated with the problem
     */
    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    /**
     * Get the challenge associated with the problem
     */
    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }

    /**
     * Get the creator of this problem
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Get all submissions for this problem
     */
    public function submissions()
    {
        return $this->hasMany(LeetcodeSubmission::class, 'problem_id');
    }

    /**
     * Get candidates who attempted this problem
     */
    public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'leetcode_submissions')
            ->withTimestamps();
    }
}
