<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static find($id)
 */
class PasswordReset extends Model {
    public $timestamps = false;
    protected $hidden = ['pivot', 'created_at', 'updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email', 'reset_token'
    ];
}
