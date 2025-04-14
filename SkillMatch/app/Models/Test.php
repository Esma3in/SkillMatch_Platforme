<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    protected $fillable=[
        'description',
        'defficulte',
        'evaluation',
    ];

    public function company(){
        return $this->belongsTo('Company::class');
    }

    public function competences(){
        return $this->belongsToMany('Competence::class','test_competence')
                    ->withTimestamps();
    }

    public function candidate(){
        return $this->belongsToMany('Candidate::class','resultats')
                    ->withPivot('result')
                    ->withTimestamps();
    }
}
