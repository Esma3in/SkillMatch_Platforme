<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $fillable =[
        'language',
        'level',
        'candidate_id'
    ];

    public function candidate(){
        return $this->belongsTo(Candidate::class);
    }
}
