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
        'files',
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

    public function candidates_selected(){
        return $this->belongsToMany(Candidate::class,'candidate_selecteds')
        ->withTimestamps();
    }


}
