<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;

    protected $fillable = [
        'objective',
        'prerequisites',
        'step_id',
        'tools_Required',
        'before_answer',
        'qcm_id',
        'company_id',
    ];

    // Relationships
    public function step()
    {
        return $this->belongsTo(Step::class);
    }

    public function qcm()
    {
        return $this->belongsTo(Qcm::class);
    }
    public function company(){
        return $this->belongsTo(Company::class);
    }
    
    public function skills(){
        return $this->belongsToMany(skill::class,'test_competence')
                    ->withTimestamps();
    }
    
    public function candidate(){
        return $this->belongsToMany(Candidate::class,'resultats')
                    ->withPivot('result')
                    ->withTimestamps();
    }
    
 
}



