<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'supply_notifications'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'refresh_token', 'created_at', 'updated_at'
    ];

    /*
     * Append paleoid attribute, true if the user is authenticated with PaleoID, false otherwise
     */
    protected $appends = ['paleoid'];

    public function getPaleoidAttribute() {
        return $this->attributes['password'] === "paleoid";
    }

}
