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
use App\Models\CandidateProblem;
use App\Models\ChallengeResult;
use App\Models\ProblemResult;
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

    public function tests()
    {
        return $this->hasManyThrough(
            Test::class,
            Result::class,
            'candidate_id',      // Clé étrangère dans results
            'id',                // Clé locale dans tests
            'id',                // Clé locale dans candidates
            'qcm_for_roadmapId'  // Clé étrangère dans results
        );
    }


    public function problems(): BelongsToMany
    {
        return $this->belongsToMany(Problem::class, 'candidate_problem')
            ->using(CandidateProblem::class)
            ->withPivot(['challenge_id', 'completed_at', 'time_spent', 'attempt_count'])
            ->withTimestamps();
    }

    public function languages(){
        return $this->hasMany(Language::class);
    }
    public function challenges()
    {
        return $this->belongsToMany(Challenge::class, 'candidate_challenge')
            ->withPivot('completed_problems', 'is_completed', 'completion_date', 'certificate_id')
            ->withTimestamps();
    }
    public function companies_selcted(){
        return $this->belongsToMany(Company::class,'companies_selecteds')
        ->withTimestamps();
    }
    public function educations(){
        return $this->belongsToMany(Formation::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }

    /**
     * Get all problem results for this candidate
     */
    public function problemResults()
    {
        return $this->hasMany(ProblemResult::class);
    }

    /**
     * Get all challenge results for this candidate
     */
    public function challengeResults()
    {
        return $this->hasMany(ChallengeResult::class);
    }
}
