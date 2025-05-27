<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeetcodeSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'problem_id',
        'candidate_id',
        'code_submitted',
        'language',
        'status',
        'test_results',
        'execution_time',
        'memory_used'
    ];

    protected $casts = [
        'test_results' => 'array',
    ];

    /**
     * Get the problem this submission is for
     */
    public function problem()
    {
        return $this->belongsTo(LeetcodeProblem::class, 'problem_id');
    }

    /**
     * Get the candidate who made this submission
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
