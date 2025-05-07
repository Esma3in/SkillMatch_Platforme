<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Badge extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'candidate_id',
        'qcm_for_roadmap_id',
        'name',
        'icon',
        'description',
        'Date_obtained',
       
     
    ];
    public function roadmap(): BelongsTo
    {
        return $this->belongsTo(Roadmap::class);
    }

    public function QcmForRoadmap(){
        return $this->belongsTo(QcmForRoadmap::class);
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }
}
