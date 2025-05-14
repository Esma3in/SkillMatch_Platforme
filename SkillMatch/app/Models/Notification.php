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
        'dateEnvoi',
        'destinataire',
        'company_id',
        'candidate_id',
    ];

    public function company(){
        return $this->belongsTo('Company::class');
    }
    public function candidate(){
        return $this->belongsTo('Candidate::class');
    }
}
