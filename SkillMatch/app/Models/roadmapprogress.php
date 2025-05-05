<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class roadmapprogress extends Model
{
    use HasFactory;
    protected $fillable = [
        'roadmap_id',
        'progress'
    ] ;
    public function roadmap(){
        return $this->belongsTo(Roadmap::class);
    }
}
