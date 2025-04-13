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
    public function uset()
    {
        return $this->belongsTo(User::class);
    }

    public function profilCandidat()
    {
        return $this->hasOne(profile_candidate::class);
    }
}
