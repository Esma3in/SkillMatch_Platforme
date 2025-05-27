<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'level',
        'skill_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the skill associated with the challenge.
     */
    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    /**
     * Get the standard problems in this challenge.
     */
    public function problems()
    {
        return $this->belongsToMany(Problem::class, 'challenge_problem')
            ->withPivot('order')
            ->orderBy('order')
            ->withTimestamps();
    }

    /**
     * Get the leetcode problems in this challenge.
     */
    public function leetcodeProblems()
    {
        return $this->hasMany(LeetcodeProblem::class);
    }

    /**
     * Get all problems (both standard and leetcode) for this challenge.
     * This is a custom method, not a relationship.
     */
    public function getAllProblems()
    {
        // Get standard problems
        $standardProblems = $this->problems()->get();

        // Get leetcode problems
        $leetcodeProblems = $this->leetcodeProblems()->get();

        // Combine and return
        return $standardProblems->concat($leetcodeProblems);
    }

    /**
     * Get the candidates who have enrolled in this challenge.
     */
    public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'candidate_challenge')
            ->withPivot('completed_problems', 'is_completed', 'completion_date', 'certificate_id')
            ->withTimestamps();
    }

    /**
     * Check if a candidate has completed this challenge.
     */
    public function isCompletedByCandidate($candidateId)
    {
        return $this->candidates()
            ->wherePivot('candidate_id', $candidateId)
            ->wherePivot('is_completed', true)
            ->exists();
    }
}
