<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prerequiste extends Model
{
    use HasFactory;
    protected $fillable =[
        'skill_id',
        'text',
        'completed'
    ];

    public function roadmap (){
        return $this->belongsToMany(Roadmap::class);
    }
    public function skill(){
        return $this->belongsTo(Skill::class);
    }
}
