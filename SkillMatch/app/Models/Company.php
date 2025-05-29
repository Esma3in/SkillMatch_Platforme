<?php

namespace App\Models;

use App\Models\CompaniesSelected;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;
    protected $fillable=[
        'user_id',
        'name',
        'logo',
        'sector',
        'file',
        'state',
        'docstate'
    ];

    // get the notifications send by this company
    public function notificaitons(){
        return $this->hasMany(Notification::class);
    }
    public function tests(){
        return $this->hasMany(Test::class);
    }

    public function skills(){
        return $this->belongsToMany(Skill::class,'companies_skills')
                    ->withTimestamps();
    }
    public function profile(){
        return $this->hasOne(ProfileCompany::class);
    }
    public function ceo(){
        return $this->hasOne(Ceo::class);
    }

    public function selectedCandidates(){
        return $this->hasMany(CandidateSelected::class);
    }

    public function services(){
        return $this->hasMany(CompanyServices::class);
    }

    public function legaldocuments(){
        return $this->hasMany(CompanyLegalDocuments::class);
    }

    public function documents(){
        return $this->hasMany(CompanyDocument::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }

}
