<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyServices extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyServicesFactory> */
    use HasFactory;

    protected $fillable = [
        'title','company_id'
    ];
    protected $casts = [
        'descriptions'=>'array'
    ];
   

    public function Company(){
        return $this-> BelongsTo(Company::class);
    }
}
