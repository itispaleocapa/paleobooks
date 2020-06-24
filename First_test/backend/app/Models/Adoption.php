<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;

/**
 * @method static find($id)
 */
class Adoption extends Model {
    public $timestamps = false;
    protected $hidden = ['pivot', 'created_at', 'updated_at'];

    protected $attributes = [
        'book_id' => 0,
        'class_id' => 0,
        'subject_id' => 0
    ];

    public function classes() {
        return $this->belongsToMany('App\Models\Adoption')->belongsToMany('App\Models\SchoolClass');
    }
}
