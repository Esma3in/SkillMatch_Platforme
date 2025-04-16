<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;
    protected $fillable=[
        'candidate_profile_id',
        'institution_name',
        'degree',
        'start_date',
        'end_date',
        'field_of_study'
    ];

    
    public function candidate_profile(){
        return $this->belongsTo('Candidate::class');
    }

    public function candidate(){
        return $this->hasOneThrough(
            //Candidate::class
            //Profile_candidate::class
            'id',
            'id',
            'candidate_id',
            'candidate_profile_id'
        );
    }
}
