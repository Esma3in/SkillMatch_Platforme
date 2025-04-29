<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidateSelected extends Model
{
    /** @use HasFactory<\Database\Factories\CandidateSelectedFactory> */
    use HasFactory;

    protected $fillable =[
        'candidate_id',
        'company_id',
    ];

    public function candidates(){
        return $this->belongsToMany(Candidate::class);
    }
    public function companies(){
        return $this->belongsToMany(Company::class);
    }
        
    

}
