<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'level',
        'type',
        'usageFrequency',
        'classement',
        'candidate_id',
        'company_id',
        'roadmap_id',
        'test_id'
    ];

    // get  the recommandede skills by Company 
    public function Company(){
        return $this->belongsToMany(Company::class);
    }
    // get  the candidate skills
    public function Candidate(){
        return $this->belongsToMany(Candidate::class);
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
