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
     * Get the problems in this challenge.
     */
    public function problems()
    {
        return $this->belongsToMany(Problem::class, 'challenge_problem')
            ->withPivot('order')
            ->orderBy('order')
            ->withTimestamps();
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
