<?php

namespace App\Models;

use App\Models\Challenge;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Serie_Challenges_selected extends Model
{
    use HasFactory;
    protected $fillable =[
        'challenge_id',
        'serie_challenge_id',
    ];
    // get the list of challenges selected to create a challenge serie
    public function Challenges(){
        return $this->hasMany(Challenge::class);
    }
    public function SerieChallenge(){
        return $this->belongsTo(Serie_Challenge::class);
    }
}
