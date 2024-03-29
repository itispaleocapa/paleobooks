<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;

/**
 * @method static find($id)
 */
class Demand extends Model {
    public $timestamps = false;
    protected $hidden = ['pivot', 'created_at', 'updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'book_id', 'user_id'
    ];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function book() {
        return $this->belongsTo('App\Models\Book');
    }
}
