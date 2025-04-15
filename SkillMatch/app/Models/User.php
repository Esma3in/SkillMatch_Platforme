<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

// class User extends Model
// {
//     protected $table = 'utilisateurs';
//     protected $fillable = ['email', 'password', 'name', 'fichiers', 'type'];

//     public function isCandidat() { return $this instanceof Candidat; }
//     public function isEntreprise() { return $this instanceof Entreprise; }
//     public function isAdministrateur() { return $this instanceof Administrateur; }
// }
class User extends Model
{
    use HasFactory;

    protected $fillable = ['name','email', 'password', 'role'];

    public function candidate()
    {
        return $this->hasOne(Candidate::class);
    }

    public function company()
    {
        return $this->hasOne(Company::class);
    }

    public function administrator()
    {
        return $this->hasOne(Administrator::class);
    }
}
