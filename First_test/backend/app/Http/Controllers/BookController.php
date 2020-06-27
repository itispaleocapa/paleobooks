<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use App\Models\SchoolClass;

class BookController extends Controller {
    public function index(Request $request) {
        $filter = $request->input('search');

        // Check if user used the search form
        if ($filter) {
            $book = Book::where('title', 'like', '%' . $filter . '%')->get();

            if ($book->isEmpty()) {
                $book = Book::where('isbn', 'like', '%' . $filter . '%')->get();
            }

            return $book;
        }

        return Book::all();
    }

    public function show($id) {
        $book = Book::find($id);
        return $book ? $book : Response()->json([], 404);
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
