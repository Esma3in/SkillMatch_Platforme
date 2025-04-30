<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialMedia extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id',
        'platform',
        'url'
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
