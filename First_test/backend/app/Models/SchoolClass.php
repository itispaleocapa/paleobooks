<?php


namespace App\Models;

use DB;
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

    public function books($id) {
        $data = DB::table('adoptions')
            ->join('classes', 'adoptions.class_id', '=', 'classes.id')
            ->join('books', 'adoptions.book_id', '=', 'books.id')
            ->where('class_id', $id)
            ->select('books.*')
            ->get();

        return $data;
    }

    public function supplies($id) {
        $data = DB::table('classes')
            ->join('adoptions', 'classes.id', '=', 'adoptions.class_id')
            ->join('supplies', 'adoptions.book_id', '=', 'supplies.book_id')
            ->where('classes.id', $id)
            ->select('supplies.*')
            ->get();

        return $data;
    }

    public function demands($id) {
        $data = DB::table('classes')
            ->join('adoptions', 'classes.id', '=', 'adoptions.class_id')
            ->join('demands', 'adoptions.book_id', '=', 'demands.book_id')
            ->where('classes.id', $id)
            ->select('demands.*')
            ->get();

        return $data;
    }
}
