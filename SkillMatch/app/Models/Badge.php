<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Badge extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'icon',
        'Date_obtained',
        'roadmap_id',
        'candidate_id',
    ];
    public function roadmap(): BelongsTo
    {
        return $this->belongsTo(Roadmap::class);
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }
}
