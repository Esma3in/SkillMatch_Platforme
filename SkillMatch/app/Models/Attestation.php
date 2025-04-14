<?php

namespace App\Models;

use App\Models\Serie_Challenge;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        return $this->belongsTo(Serie_Challenge::class, 'series_challenge_id');
    }
}
