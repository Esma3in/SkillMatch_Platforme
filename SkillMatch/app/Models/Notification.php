<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = 
    [
        'message',
        'dateenvoi',
        'destinataire',
    ];

    public function company(){
        return $this->belongsTo('Entrprises::class');
    }
    public function candidate(){
        return $this->belongsTo('Candidate::class');
    }
}
