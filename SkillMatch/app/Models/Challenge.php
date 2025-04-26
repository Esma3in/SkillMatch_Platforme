<?php

namespace App\Models;

use App\Models\Candidate;
use App\Models\SerieChallenge;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Challenge extends Model
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
    // get the candidates solve this challenge
    public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'candidate_challenge');
    }


}
