<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProblemResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id',
        'problem_id',
        'problem_type',
        'challenge_id',
        'status',
        'code_submitted',
        'language',
        'attempts',
        'time_spent_seconds',
        'completed_at'
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'attempts' => 'integer',
        'time_spent_seconds' => 'integer',
    ];

    /**
     * Get the candidate that completed the problem.
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * Get the challenge this completion is associated with.
     */
    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }

    /**
     * Get the problem based on problem_type
     */
    public function problem()
    {
        if ($this->problem_type === 'standard') {
            return $this->belongsTo(Problem::class, 'problem_id');
        } else if ($this->problem_type === 'leetcode') {
            return $this->belongsTo(LeetcodeProblem::class, 'problem_id');
        }

        return null;
    }
}
