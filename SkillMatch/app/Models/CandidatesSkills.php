<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidatesSkills extends Model
{
    use HasFactory;

    protected $fillable=[
        'candidate_id',
        'company_id'
    ];

    public function Candidates(){
        return $this->belongsToMany(Candidate::class);
    }
    public function Companies(){
        return $this->belongsToMany(Candidate::class);
    }
    public function challenges()
    {
        return $this->belongsToMany(Challenge::class, 'candidate_challenge');
    }

}
