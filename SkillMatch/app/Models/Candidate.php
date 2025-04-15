<?php

namespace App\Models;

use App\Models\Test;
use App\Models\Badge;
use App\Models\Skill;
use App\Models\Result;
use App\Models\Roadmap;
use App\Models\Challenge;
use App\Models\Attestation;
use App\Models\Notification;
use App\Models\Profile_candidate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Candidate extends Model
{
    use HasFactory ;

    protected $fillable = ['id',
    'name',
    'dateInscription',
    'files'
    ];



    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile_candidate::class);
    }

    public function result(): HasOne
    {
        return $this->hasOne(Result::class);
    }

    public function badges(): HasMany
    {
        return $this->hasMany(Badge::class);
    }

    public function attestations(): HasMany
    {
        return $this->hasMany(Attestation::class);
    }

    public function roadmaps(): HasMany
    {
        return $this->hasMany(Roadmap::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class);
    }

    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(Test::class);
    }


    public function challenges(): BelongsToMany
    {
        return $this->belongsToMany(Challenge::class);
    }

}
