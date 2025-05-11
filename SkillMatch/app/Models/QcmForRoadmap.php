<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class QcmForRoadmap extends Model
{
    use HasFactory;

    protected $fillable = [
        'question',
        'options',
        'correct_answer',
        'skill_id'
    ];

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    public function roadmap()
    {
        return $this->belongsTo(Roadmap::class);
    }
    public function result (){
        return $this->belongsTo(Result::class);
    }
}
