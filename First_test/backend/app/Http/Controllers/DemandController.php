<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Book;
use App\Models\Demand;
use App\Models\SchoolClass;

class DemandController extends Controller {
    /*public function getList() {
        return Demand::with(['book:id,title,isbn', 'user'])->get();
    }*/

    public function create(Request $request) {
        $book = Book::where('id', $request->input('book'))->get();

        $this->validate($request, [
            'book' => 'required',
        ]);

        if(!empty($book[0])) {
            echo "Book exists<pre>";
            print_r($book);
        } else {
            echo "Book doesn't exists";
        }
        print_r($request->all());
        die();

        $demand = Demand::create($request->all());

        return response()->json($demand, 201);
    }
}
