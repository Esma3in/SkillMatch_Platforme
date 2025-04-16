<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;
    protected $fillable=[
        'candidate_profile_id',
        'title',
        'company_name',
        'start_date',
        'end_date',
        'description'
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
            'profile_candidate_id'
        );
    }
}
