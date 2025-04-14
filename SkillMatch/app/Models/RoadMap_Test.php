<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class RoadMap_Test extends Model
{
    use HasFactory;

    protected $fillable = [
        'roadmap_id',
        'title',
        'description',
        'total_score',
        'start_date',
        'end_date',
    ];

    public function roadmap(): BelongsTo
    {
        return $this->belongsTo(Roadmap::class);
    }

    public function candidates(): BelongsToMany
    {
        return $this->belongsToMany(Candidate::class, 'candidate_test_roadmap')
                    ->withPivot('score', 'status', 'passed_at')
                    ->withTimestamps();
    }
}
