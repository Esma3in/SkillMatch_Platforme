<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;
    protected $fillable=[
        'candidate_id',
        'test_id',
        'score',
        'candidateAnswer',
        "correctAnswer"
    ];

    //get the results of an candidate
    public function Candidate(){
        return $this->belongsTo(Candidate::class);
    }
    // get the test which have this result
    public function Test(){
        return $this->belongsTo(Test::class);
    }
    
}

