<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attestation extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'title',
        'description',
        'signature',
        'candidate_id',
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function seriesChallenge() : BelongsTo
    {
        return $this->belongsTo(SeriesChallenge::class, 'series_challenge_id');
    }
}
