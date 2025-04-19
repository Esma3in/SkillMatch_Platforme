<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompaniesSkills extends Model
{
    /** @use HasFactory<\Database\Factories\CompaniesSkillsFactory> */
    use HasFactory;

    protected $fillable = [
        'company_id',
        'skill_id'
    ];
}
