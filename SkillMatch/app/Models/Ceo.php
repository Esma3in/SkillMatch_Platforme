<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ceo extends Model
{
    /** @use HasFactory<\Database\Factories\CeoFactory> */
    use HasFactory;

    protected $fillable=[

        'name',
        'company_id',
        'avatar',
        'description',
    ];


    public function company(){
        return $this->belongsTo(Company::class);
    }
}
