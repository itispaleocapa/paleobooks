<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\SchoolClass;

class BookController extends Controller {
    public function getList() {
        return Book::all();
    }

    public function getBook($id) {
        $book = Book::find($id);
        return $book ? $book : Response()->json([], 404);
    }

    public function getBookClasses($id) {
        $book = Book::find($id);
        return $book ? $book->classes : Response()->json([], 404);
    }
}
