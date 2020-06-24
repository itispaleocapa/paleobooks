<?php


namespace App\Models;

use DB;
use App\Models\Adoption;

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

    public function classes($id) {
        $data = DB::table('adoptions')
        ->join('classes', 'adoptions.class_id', '=', 'classes.id')
        ->where('book_id', $id)
        ->select('classes.name', 'classes.school_year')
        ->get();

        return $data; // $this->belongsToMany('App\Models\SchoolClass');
    }

    public function supplies($id) {
        $data = DB::table('supplies')
        ->join('books', 'supplies.book_id', '=', 'books.id')
        ->where('book_id', $id)
        ->select('books.title', 'supplies.*'/*, 'classes.school_year'*/)
        ->get();

        return $data; // $this->belongsToMany('App\Models\SchoolClass');
    }

    public function demands($id) {
        $data = DB::table('demands')
        ->join('books', 'demands.book_id', '=', 'books.id')
        ->where('book_id', $id)
        ->select('books.title', 'demands.*'/*, 'classes.school_year'*/)
        ->get();

        return $data; // $this->belongsToMany('App\Models\SchoolClass');
    }
}
