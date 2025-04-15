<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory ;

    protected $fillable = ['nom', 'secteur', 'fichiers', 'utilisateur_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function profilEntreprise()
    {
        return $this->hasOne(profile_company::class);
    }

    public function test()
    {
        return $this->hasMany(Test::class);
    }

    public function skill()
    {
        return $this->hasMany(Skill::class);
    }
    public function notification()
    {
        return $this->hasMany(Notification::class);
    }
}
