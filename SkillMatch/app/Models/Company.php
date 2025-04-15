<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;
    protected $fillable=[
        'name',
        'sector',
        'files',
       'profileCompany_id'
    ];

    // get the notifications send by this company
    public function notificaitons(){
        return $this->hasMany(Notification::class);
    }
    public function tests(){
        return $this->hasMany(Test::class);
    }

}
