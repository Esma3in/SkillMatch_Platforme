<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Psy\TabCompletion\Matcher\FunctionsMatcher;

class ProfileCompany extends Model
{
    use HasFactory;
    protected $fillable =[
        'serieNumber',
        'reasonSocial',
        'address',
        'phone',
        'email',
        'capital',
        'salesfigures',
        'nbEmployers',
        'DateCreation',
        'status',
        'skill_id',
        'company_id',
        'candidate_id'
    ];

    // gett the competences of an  companyh
    public function skills(){
        return $this->hasMany(Skill::class);

    }
    // get the company associted to this profile 
    public function company(){
        return $this->belongsTo(Company::class);
    }
    // get the candidates selected wanted this company
    public function candidate(){
        return $this->hasMany(Candidate::class);
    }

}
