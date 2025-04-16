<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
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
