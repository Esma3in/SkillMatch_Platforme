<?php

namespace App\Models;

use App\Models\SkillRoadmap;
use App\Models\Roadmap;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tool extends Model
{
    protected $fillable = [
        'name',
        'description',
        'link',
        'image',
    ];

    public function skillsRoadmap(): HasMany
    {
        return $this->hasMany(SkillRoadmap::class);
    }

    public function Roadmap(): BelongsToMany
    {
        return $this->belongsToMany(Roadmap::class);
    }
}
