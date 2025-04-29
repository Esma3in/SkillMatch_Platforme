<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Qcm extends Model
{
    /** @use HasFactory<\Database\Factories\QcmFactory> */
    use HasFactory;
    protected $fillable=[
            'question' ,
            'option_a',
            'option_b' ,
            'option_c',
            'option_d',
            'corrected_option'
    ];
}
