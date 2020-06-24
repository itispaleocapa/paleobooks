<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;

/**
 * @method static find($id)
 */
class SchoolClass extends Model {
    public $timestamps = false;

    protected $table = 'classes';

    protected $hidden = ['pivot'];

    protected $attributes = [
        'name' => '',
        'school_year' => '0000-0000'
    ];

    public function books() {
        return $this->belongsToMany('App\Models\Book');
    }
}
