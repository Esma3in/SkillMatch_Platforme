<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class roadmapprogress extends Model
{
    use HasFactory;
    protected $table = 'roadmapsprogress';
    protected $fillable = [
        'roadmap_id',
        'progress',
        'candidate_id',
        'steps'
    ] ;
    
    protected $casts = [
        'steps' => 'json'
    ];
    
    public function roadmap(){
        return $this->belongsTo(Roadmap::class);
    }
}
