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
        $book = Book::where('id', $request->input('book_id'))->first();

        $this->validate($request, [
            'book_id' => 'required',
        ]);

        if(!$book) {
            return response()->json([
                'error' => 'Provided book doesn\'t exist.'
            ], 400);
        }

        // Check if the user already have a demand for the given book
        $demand = Demand::where('book_id', $book->id)
            ->where('user_id', $request->auth->id)
            ->first();
        // Return error 400 if exists
        if ($demand) {
            return response()->json([
                'error' => 'You already have a demand for this book.'
            ], 400);
        } 

        $request->merge(['user_id' => $request->auth->id]);

        $demand = Demand::create($request->all());

        return response()->json([
            'success' => 'Demand created successfully'
        ], 201);
    }

    public function update(Request $request, $id) {
        $demand = Demand::find($id);

        if (!$demand) {
            Response()->json([], 404);
        }

        // Check and validate the updated book
        $book = $request->input('book_id');
        if ($book) {
            $this->validate($request, [
                'book_id' => 'required',
            ]);

            //Update the name
            $demand->book_id = $book;
        }

        if ($demand->isDirty()) {
            try {
                $demand->save();
            } catch (Exception $e) {
                return response()->json([
                    'error' => 'An error while updating up.' // To get the error message use this: $e->getMessage()
                ], 400);
            }
        } else {
            return response()->json([
                'error' => 'Nothing to update.'
            ], 400);
        }

        return response()->json([
            'success' => 'Demand updated successfully.'
        ], 201);
    }

    public function destroy($id) {
        $demand = Demand::find($id);

        if (!$demand) {
            return response()->json([], 404);
        }

        $demand->delete();

        return response()->json([
            'success' => 'Demand deleted successfully'
        ], 201);
    }
}
