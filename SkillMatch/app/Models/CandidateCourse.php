<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateCourse extends Model
{
    protected $fillable= [
        'name',
        'provider',
        'link',
        'duration',
        'completed'
    ];
    public function roadmap(){
        return $this->belongsToMany(Roadmap::class);
    }
}

