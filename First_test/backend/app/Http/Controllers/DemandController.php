<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Book;
use App\Models\Demand;
use App\Models\SchoolClass;

class DemandController extends Controller {
    public function index(Request $request) {
		$filter = $request->input('search');

        // Check if user used the search form
        if ($filter) { 
			$demand = Demand::with(['book:id,title,isbn', 'user'])
				->whereHas('book', function($q) use($filter) {
					$q->where('books.title', 'like', '%' . $filter . '%');
				})->get();

            if ($demand->isEmpty()) {
                $demand = Demand::with(['book:id,title,isbn', 'user'])
				->whereHas('book', function($q) use($filter) {
					$q->where('books.isbn', 'like', '%' . $filter . '%');
				})->get();
            }

            return $demand;
        }
		
        return Demand::with(['book:id,title,isbn', 'user'])->get();
    }
	
	public function getUserDemands(Request $request) {
        return Demand::with(['book:id,title,isbn'])->where('user_id', $request->auth->id)->get();
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

        if ($request->auth->id != $demand->user_id) {
            return response()->json([
                'error' => 'You are not authorized to edit this demand.'
            ], 400);
        }

        // Check and validate the updated book
        $book = $request->input('book_id');
        if ($book) {
            $this->validate($request, [
                'book_id' => 'required',
            ]);

            // Check if the book exists and if the user has not already a demand with the updated book
            $check_book = Book::find($book);
            if ($check_book) {
                $check_demand = Demand::where('book_id', $book)
                    ->where('user_id', $request->auth->id)
                    ->first();
                // Return error 400 if exists
                if ($check_demand) {
                    return response()->json([
                        'error' => 'You already have a demand for this book.'
                    ], 400);
                } 
            } else {
                return response()->json([
                    'error' => 'Provided book doesn\'t exist.'
                ], 400);
            }

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

    public function destroy(Request $request, $id) {
        $demand = Demand::find($id);

        if (!$demand) {
            return response()->json([], 404);
        }
		
		if ($request->auth->id != $demand->user_id) {
            return response()->json([
                'error' => 'You are not authorized to delete this demand.'
            ], 400);
        }

        $demand->delete();

        return response()->json([
            'success' => 'Demand deleted successfully'
        ], 201);
    }
}
