<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;

/**
 * @method static find($id)
 */
class Offer extends Model {
    public $timestamps = false;
    protected $hidden = ['book_id', 'user_id', 'pivot'];

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function book() {
        return $this->belongsTo('App\Models\Book');
    }
}
