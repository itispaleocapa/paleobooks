<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;

/**
 * @method static find($id)
 */
class Book extends Model {
    public $timestamps = false;
    protected $hidden = ['pivot'];

    protected $attributes = [
        'title' => '',
        'isbn' => '',
        'price' => 0.00
    ];

    public function classes() {
        return $this->belongsToMany('App\Models\SchoolClass');
    }
}
