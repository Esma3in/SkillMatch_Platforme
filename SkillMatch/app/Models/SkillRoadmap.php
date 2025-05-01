<?php

namespace App\Models;

use App\Models\Tool;
use App\Models\Skill;
use App\Models\Roadmap;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SkillRoadmap extends Model
{
    protected $fillable = [
        'skill_id',
        'tool_id',
        'roadmap_id',
        'text',
        'completed',
    ];

    protected $casts = [
        'completed' => 'boolean',
    ];

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }

    public function tool(): BelongsTo
    {
        return $this->belongsTo(Tool::class);
    }

    public function Roadmap(): BelongsToMany
    {
        return $this->belongsToMany(Roadmap::class);
    }
}
