<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CandidateProblem extends Pivot
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'candidate_problem';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'candidate_id',
        'problem_id',
        'challenge_id',
        'completed_at',
        'time_spent',
        'attempt_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'completed_at' => 'datetime',
        'time_spent' => 'integer',
        'attempt_count' => 'integer',
    ];

    /**
     * Get the candidate that completed the problem.
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * Get the problem that was completed.
     */
    public function problem()
    {
        return $this->belongsTo(Problem::class);
    }

    /**
     * Get the challenge this completion is associated with.
     */
    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }
}
