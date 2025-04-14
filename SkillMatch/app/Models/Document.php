<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable=[
        'candidate_profile_id',
        'document_type',
        'file_path',
    ];

    public function profile_candidate(){
        return $this->belongsTo('Candidate::class');
    }
    public function candidate(){
        return $this->hasOneThrough(
            //Candidate::class,
            //Profile_candidate::class,
            'id',
            'id',
            'candidate_id',
            'profile_candidate_id'
        );
    }
}
