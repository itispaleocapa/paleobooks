<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Book;
use App\Models\Supply;
use App\Models\SchoolClass;

class SupplyController extends Controller {
    public function index(Request $request) {
		$filter = $request->input('search');

        // Check if user used the search form
        if ($filter) {
			$supply = Supply::with(['book:id,title,isbn,price', 'user'])
				->whereHas('book', function($q) use($filter) {
					$q->where('books.title', 'like', '%' . $filter . '%');
				})->get();

            if ($supply->isEmpty()) {
                $supply = Supply::with(['book:id,title,isbn,price', 'user'])
				->whereHas('book', function($q) use($filter) {
					$q->where('books.isbn', 'like', '%' . $filter . '%');
				})->get();
            }

            return $supply;
        }

        return Supply::with(['book:id,title,isbn,price', 'user'])->get();
    }

	public function getUserSupplies(Request $request) {
        return Supply::with(['book:id,title,isbn,price'])->where('user_id', $request->auth->id)->get();
    }

    public function show(Request $request, $id) {
        $supply = Supply::find($id);

        return $supply ? Supply::with(['book:id,title,isbn,price', 'user'])->where('id', $supply->id)->first() : Response()->json([], 404);
    }

    public function create(Request $request) {
        $book = Book::where('id', $request->input('book_id'))->first();

        $this->validate($request, [
            'book_id' => 'required',
            'price' => 'required|numeric|between:0,' . $book->price
        ]);

        if(!$book) {
            return response()->json([
                'error' => 'Provided book doesn\'t exist.'
            ], 400);
        }

        // Check if the user already have a supply for the given book
        $supply = Supply::where('book_id', $book->id)
            ->where('user_id', $request->auth->id)
            ->first();
        // Return error 400 if exists
        if ($supply) {
            return response()->json([
                'error' => 'You already have a supply for this book.'
            ], 400);
        }

        $request->merge(['user_id' => $request->auth->id]);

        $supply = Supply::create($request->all());

        return response()->json([
            'success' => 'Supply created successfully'
        ], 201);
    }

    public function update(Request $request, $id) {
        $supply = Supply::find($id);

        if (!$supply) {
            Response()->json([], 404);
        }

        if ($request->auth->id != $supply->user_id) {
            return response()->json([
                'error' => 'You are not authorized to edit this supply.'
            ], 400);
        }

        // Check and validate the updated book
        $book = $request->input('book_id');
        if ($book) {
            $this->validate($request, [
                'book_id' => 'required',
            ]);

            // Check if the book exists and if the user has not already a supply with the updated book
            $check_book = Book::find($book);
            if ($check_book) {
                $check_supply = Supply::where('book_id', $book)
                    ->where([['user_id', '=', $request->auth->id], ['id', '!=', $supply->id]])
                    ->first();
                // Return error 400 if exists
                if ($check_supply) {
                    return response()->json([
                        'error' => 'You already have a supply for this book.'
                    ], 400);
                }
            } else {
                return response()->json([
                    'error' => 'Provided book doesn\'t exist.'
                ], 400);
            }

            //Update the book
            $supply->book_id = $book;
        }

        // Check and validate the updated price
        $price = $request->input('price');
        if ($price) {
            if ($supply->isDirty()) {
                $book = Book::where('id', $book)->first();
            } else {
                $book = Book::where('id', $supply->book_id)->first();
            }

            $this->validate($request, [
                'price' => 'required|numeric|between:0,' . $book->price
            ]);

            //Update the name
            $supply->price = $price;
        }

        if ($supply->isDirty()) {
            try {
                $supply->save();
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
            'success' => 'Supply updated successfully.'
        ], 201);
    }

    public function destroy(Request $request, $id) {
        $supply = Supply::find($id);

        if (!$supply) {
            return response()->json([], 404);
        }

		if ($request->auth->id != $supply->user_id) {
            return response()->json([
                'error' => 'You are not authorized to delete this supply.'
            ], 400);
        }

        $supply->delete();

        return response()->json([
            'success' => 'Supply deleted successfully'
        ], 201);
    }
}
