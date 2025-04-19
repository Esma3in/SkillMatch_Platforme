<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;
    protected $fillable=[
        'description',
        'defficulte',
        'evaluation',
    ];

    public function company(){
        return $this->belongsTo(Company::class);
    }

    public function skills(){
        return $this->belongsToMany(skill::class,'test_competence')
                    ->withTimestamps();
    }

    public function candidate(){
        return $this->belongsToMany(Candidate::class,'resultats')
                    ->withPivot('result')
                    ->withTimestamps();
    }
}
