<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\SchoolClass;

class BookController extends Controller {
    public function index() {
        return Book::all();
    }

    public function show($id) {
        $book = Book::find($id);
        return $book ? $book : Response()->json([], 404);
    }

    public function getBookClasses($id) {
        $book = Book::find($id);
        return $book ? $book->classes($id) : Response()->json([], 404);
    }

    public function getBookSupplies($id) {
        $book = Book::find($id);
        return $book ? $book->supplies($id) : Response()->json([], 404);
    }

    public function getBookDemands($id) {
        $book = Book::find($id);
        return $book ? $book->demands($id) : Response()->json([], 404);
    }
}
