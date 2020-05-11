<?php

namespace App\Http\Controllers;

use App\Book;
//use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    //

    public function showAllBooks(){
      return response()->json(Book::all());
    }
}
