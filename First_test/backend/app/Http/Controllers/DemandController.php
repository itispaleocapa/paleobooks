<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Book;
use App\Models\Demand;
use App\Models\SchoolClass;

class DemandController extends Controller {
    public function index() {
        return Demand::with(['book:id,title,isbn', 'user'])->get();
    }

    public function show(Request $request, $id) {

        $demand = Demand::find($id);

        return $demand ? Demand::with(['book:id,title,isbn', 'user'])->where('id', $id)->first() : Response()->json([], 404);
    }

    public function create(Request $request) {
        $book = Book::where('id', $request->input('book_id'))->get();

        $this->validate($request, [
            'book_id' => 'required',
        ]);

        if(empty($book[0])) {
            return response()->json([
                'error' => 'Provided book doesn\'t exist.'
            ], 400);
        }

        $request->merge(['user_id' => $request->auth->id]);

        $demand = Demand::create($request->all());

        return response()->json([
            'success' => 'Supply created successfully'
        ], 201);
    }

    public function update() {
        return 'to be implemented';
    }

    public function destroy() {
        return 'to be implemented';
    }
}
