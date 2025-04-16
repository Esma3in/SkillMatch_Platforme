<?php

namespace App\Models;

use App\Models\Candidate;
use App\Models\ProfileCompany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class ProfileCandidate extends Model
{

use HasFactory ;
    protected $fillable = ['experience', 'formation', 'photoProfil', 'langage', 'localisation', 'competenceList', 'candidat_id'];

    // bcuz it's better to stock array variabeles on other varibake protected
    protected $casts = [
        'experience' => 'array',
        'formation' => 'array',
        'langage' => 'array',
        'localisation' => 'array',
        'competenceList' => 'array',
    ];

    public function candidat()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function profileCompany()
    {
        return $this->ManyToMany(ProfileCompany::class);
    }
}
