<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roadmap extends Model
{
    use HasFactory;
    protected $fillable=[
        'skill_id',
        'candidate_id'
    ];
    // get the candidate correspnonding to this roadmap
    public function Candidate(){
        return $this->belongsTo(Candidate::class);
    }
    // get the skills which will be used to generate this roadmap
    public function Skills(){
        return $this->hasMany(Skill::class);
    }

}
