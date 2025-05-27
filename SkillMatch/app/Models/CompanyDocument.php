<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'document_type',
        'file_path',
        'is_validated',
        'status',
        'validated_at',
        'validated_by'
    ];

    protected $casts = [
        'is_validated' => 'boolean',
        'validated_at' => 'datetime',
    ];

    /**
     * Get the possible status values for documents
     */
    public static function getStatusOptions()
    {
        return ['pending', 'valid', 'invalid'];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }
}
