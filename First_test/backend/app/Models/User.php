<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;

/**
 * @method static find($id)
 */
class User extends Model {
    public $timestamps = false;
    protected $hidden = ['pivot'];

    protected $attributes = [
        'name' => '',
    ];
}
