<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'level',
        'skill_id',
    ];

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    public function problems()
    {
        return $this->hasMany(Problem::class);
    }
        public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'candidate_challenge')->withTimestamps();
    }

}
