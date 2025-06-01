
<?php
use Illuminate\Database\Eloquent\Model;

class ResetPassword extends Model
{
    public $timestamps = false;

    protected $table = 'password_resets';

    protected $fillable = [
        'email',
        'token',
        'created_at',
    ];
}
