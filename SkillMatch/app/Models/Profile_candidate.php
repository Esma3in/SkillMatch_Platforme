<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Profile_candidate extends Model
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
}
