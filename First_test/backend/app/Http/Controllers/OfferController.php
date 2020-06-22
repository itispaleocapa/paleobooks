<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Book;
use App\Models\Offer;
use App\Models\SchoolClass;

class OfferController extends Controller {
    public function getList() {
        return Offer::with(['book:id,title,isbn', 'user'])->get();
    }

    public function create(Request $request) {
        $book = Book::where('id', $request->input('book'))->get();

        $this->validate($request, [
            'book' => 'required',
            //'email' => 'required|email|unique:users'
        ]);

        if(!empty($book[0])) {
            echo "Book exists<pre>";
            print_r($book);
        } else {
            echo "Book doesn't exists";
        }
        die();

        $offer = Offer::create($request->all());

        return response()->json($offer, 201);
    }
}
