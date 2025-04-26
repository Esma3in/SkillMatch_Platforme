<?php

namespace App\Models;

use App\Models\Test;
use App\Models\Company;
use App\Models\Roadmap;
use App\Models\Candidate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Skill extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'level',
        'type',
        'usageFrequency',
        'classement',
        'test_id'
    ];

    // get  the recommandede skills by Company 
    public function Companies(){
        return $this->belongsToMany(Company::class,'companies_skills')
                    ->withTimestamps();
    }
    // get  the candidate skills
// app/Models/Skill.php
    public function Candidates()
    {
        return $this->belongsToMany(Candidate::class, 'candidates_skills', 'skill_id', 'candidate_id');
    }
    // get the corresponding roadmap for this skill
    public function Roadmap(){
        return $this->belongsToMany(Roadmap::class);
    }
    // get the corresponding challenge
    public function Challenge(){
        return $this->belongsToMany(Challenge::class());
    }
    //get the corresponding test of an company that test by this skill
    public function tests(){
        return $this->belongsToMany(Test::class);
    }
    
}
