<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class QcmForRoadmap extends Model
{
    use HasFactory;

    protected $fillable = [
    
        'roadmap_id'
    ];
    public function result (){
        return $this->belongsTo(Result::class);
    }
    public function roadmap(){
        return $this->belongsTo(Roadmap::class);
    }
}
