<?php

namespace App\Models;

use App\Models\Test;
use App\Models\Badge;
use App\Models\Skill;
use App\Models\Result;
use App\Models\Roadmap;
use App\Models\Problem;
use App\Models\Attestation;
use App\Models\Notification;
use App\Models\ProfileCandidate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Candidate extends Model
{
    use HasFactory ;

    protected $fillable = [
    'user_id',
    'name',
    'email',
    'password',
    'state',
    'documentState',
    ];

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function profile(): HasOne
    {
        return $this->hasOne(ProfileCandidate::class);
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
        return $this->belongsToMany(Skill::class,'candidates_skills')
                    ->withTimestamps();
    }

    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(Test::class, 'Results')
                    ->withPivot('score')  // Utilisez 'score' au lieu de 'result'
                    ->withTimestamps();
    }


    public function problems(): BelongsToMany
    {
        return $this->belongsToMany(Problem::class);
    }

    public function languages(){
        return $this->hasMany(Language::class);
    }
    public function challenges()
    {
        return $this->belongsToMany(Challenge::class, 'candidate_challenge')->withTimestamps();
    }
    public function companies_selcted(){
        return $this->belongsToMany(Company::class,'companies_selecteds')
        ->withTimestamps();
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

}
