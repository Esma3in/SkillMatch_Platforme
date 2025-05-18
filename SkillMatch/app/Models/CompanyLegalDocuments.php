<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyLegalDocuments extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyLegalDocumentsFactory> */
    use HasFactory;

    protected $fillable=[
        'company_id',
        'title',
        'descriptions'
    ];

    protected $casts =[
        'descriptions'=>'array'
    ];


    public function company(){
        return $this->belongsTo(Company::class);
    }
}
