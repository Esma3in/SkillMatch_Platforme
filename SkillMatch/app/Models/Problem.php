<?php

namespace App\Models;

use App\Models\Candidate;
use App\Models\SerieChallenge;
use App\Models\CandidateProblem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Problem extends Model
{
    use HasFactory;
    protected $fillable=[
        'name',
        'description',
        'figure',
        'tags',
        'level',
        'example',
        'inputFormat',
        'outputFormat',
        'skill_id'
    ];

    // get series defies
    public function SeriesChallenges(){
        return $this->hasMany(SerieChallenge::class);
    }
    // get the skills should be attempt while solving this challenge
    public function skill()
    {
        return $this->belongsTo(\App\Models\Skill::class);
    }
    // get the admin who create this challenge
    public function Administrator(){
        return $this->belongsTo(Administrator::class);
    }
    // get the candidates solve this problem
    public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'candidate_problem')
            ->using(CandidateProblem::class)
            ->withPivot(['challenge_id', 'completed_at', 'time_spent', 'attempt_count'])
            ->withTimestamps();
    }

    /**
     * Get the challenges that include this problem.
     */
    public function challenges()
    {
        return $this->belongsToMany(Challenge::class, 'challenge_problem')
            ->withPivot('order')
            ->withTimestamps();
    }

}
