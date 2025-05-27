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
        'tools_required',
        'before_answer',
        'qcm_id',
        'company_id',
        'skill_id'
    ];

    // Relationships
    public function steps()
    {
        return $this->hasMany(Step::class);
    }

    public function qcm()
    {
        return $this->belongsTo(Qcm::class);
    }


    public function company(){
        return $this->belongsTo(Company::class);
    }


    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'test_skills')
                    ->withTimestamps();
    }

    public function skill(){
        return $this->belongsTo(Skill::class);
    }


    public function candidate()
    {
        return $this->hasManyThrough(
            Candidate::class,
            Result::class,
            'qcm_for_roadmapId', // Clé étrangère dans results
            'id',                // Clé locale dans candidates
            'qcm_id',            // Clé locale dans tests
            'candidate_id'       // Clé étrangère dans results
        );
    }
    public function prerequisites()
{
    return $this->hasManyThrough(
        Prerequiste::class,
        Skill::class,
        'id',            // Local key on Skill
        'skill_id',      // Foreign key on Prerequisite
        'id',            // Local key on Test
        'id'             // Local key on Skill
    );
}

}
