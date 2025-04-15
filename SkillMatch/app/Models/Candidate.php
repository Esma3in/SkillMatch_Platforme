<?php

namespace App\Models;

use App\Models\Profile_candidate;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Candidate extends Model
{
    use HasFactory ;

    protected $fillable = ['name', 'dateInscription', 'fichiers', 'utilisateur_id'];

    protected $dates = ['dateInscription'];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function profilCandidat()
    {
        return $this->hasOne(profile_candidate::class);
    }

    public function resultat()
    {
        return $this->hasOne(Result::class);
    }
    public function skill():hasMany
    {
        return $this->hasMany(Skill::class);
    }

    public function badge():hasMany
    {
        return $this->hasMany(Badge::class);
    }

    public function attestation():hasMany
    {
        return $this->hasMany(Attestation::class);
    }

    public function test():hasMany
    {
        return $this->hasMany(Test::class);
    }

    public function notification():hasMany
    {
        return $this->hasMany(Notification::class);
    }
}
