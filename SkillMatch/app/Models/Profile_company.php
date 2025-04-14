<?php

namespace App\Models;

use App\Models\Company;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile_company extends Model
{

use HasFactory;
    protected $fillable = [
        'siret', 'raisonSociale', 'secteurActivite', 'adresse', 'telephone', 'email','siteweb', 'capital', 'chiffreAffaires', 'nombreEmployes', 'dateCreation',
        'statut', 'competencesList', 'entreprise_id'
    ];

    protected $casts = [
        'competencesList' => 'array',
        'dateCreation' => 'date',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
