<?php


namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static find($id)
 */
class Book extends Model {
    public $timestamps = false;
    protected $hidden = ['pivot', 'created_at', 'updated_at'];

    protected $attributes = [
        'title' => '',
        'isbn' => '',
        'price' => 0.00
    ];

    public function supplies($id) {
        $data = DB::table('books')
        ->join('supplies', 'books.id', '=', 'supplies.book_id')
        ->where('books.id', $id)
        ->select('books.id', 'books.title', 'supplies.*')
        ->get();

        return $data; // $this->belongsToMany('App\Models\SchoolClass');
    }

    public function demands($id) {
        $data = DB::table('books')
        ->join('demands', 'books.id', '=', 'demands.book_id')
        ->where('books.id', $id)
        ->select('books.id', 'books.title', 'demands.*')
        ->get();

        return $data; // $this->belongsToMany('App\Models\SchoolClass');
    }
}
