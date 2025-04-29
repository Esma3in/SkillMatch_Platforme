<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Step extends Model
{
    /** @use HasFactory<\Database\Factories\StepFactory> */
    use HasFactory;
    protected $fillable=[
        'title',
        'test_id',
        'description',
        'order',
        'completed'
    ];
    public function test(){
        return $this->belongsTo(Test::class);
    }
}
