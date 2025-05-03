<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoadmapSkill extends Model
{
    use HasFactory;
    protected $table = 'roadmap_skill'; 

    protected $fillable = ['roadmap_id', 'skill_id'];
}
