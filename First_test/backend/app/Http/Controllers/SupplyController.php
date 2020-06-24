<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Book;
use App\Models\Supply;
use App\Models\SchoolClass;

class SupplyController extends Controller {
    public function index() {
        return Supply::with(['book:id,title,isbn', 'user'])->get();
    }

    public function show(Request $request, $id) {

        $supply = Supply::find($id);

        return $supply ? Supply::with(['book:id,title,isbn', 'user'])->where('id', $supply->id)->first() : Response()->json([], 404);
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

        $supply = Supply::create($request->all());

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
