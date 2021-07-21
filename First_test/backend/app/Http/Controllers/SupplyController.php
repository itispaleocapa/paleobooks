<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Book;
use App\Models\Supply;
use App\Models\SchoolClass;
use App\Mail\SupplyMail;
use App\User;
use Illuminate\Support\Facades\Mail;


class SupplyController extends Controller {
    public function index(Request $request) {
		$filter = $request->input('search');

        // Check if user used the search form
        if ($filter) {
			$supply = Supply::with(['book:id,title,isbn,price,photo', 'user'])
				->whereHas('book', function($q) use($filter) {
					$q->where('books.title', 'like', '%' . $filter . '%');
				})->get();

            if ($supply->isEmpty()) {
                $supply = Supply::with(['book:id,title,isbn,price,photo', 'user'])
				->whereHas('book', function($q) use($filter) {
					$q->where('books.isbn', 'like', '%' . $filter . '%');
				})->get();
            }

            return $supply;
        }

        return Supply::with(['book:id,title,isbn,price,photo', 'user'])->get();
    }

	public function getUserSupplies(Request $request) {
        return Supply::with(['book:id,title,isbn,price,photo'])->where('user_id', $request->auth->id)->get();
    }

    public function show(Request $request, $id) {
        $supply = Supply::find($id);

        return $supply ? Supply::with(['book:id,title,isbn,price,photo', 'user'])->where('id', $supply->id)->first() : Response()->json(['error' => 'Supply not found'], 404);
    }

    public function create(Request $request) {
        $book = Book::where('id', $request->input('book_id'))->first();

        $this->validate($request, [
            'book_id' => 'required',
            'price' => 'required|numeric|between:0,' . $book->price,
            'info' => 'required'
        ]);

        $info = json_decode($request->input('info'), true);
        $info['img'] = [];
        foreach ($request->input('img') as $key => $value) {
            if ($value['encode']) {
                $image = substr(explode(";", $value['encode'])[1], 7);
                $name = bin2hex(random_bytes(10)) . '-' . $request->auth->id . '.jpeg';
                file_put_contents('../../../img/' . $name, base64_decode($image));
                array_push($info['img'], $name);
            }
        }

        if (!$book) {
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

        $requestData = json_decode($request->info, true);
        $requestData['img'] = $info['img'];
        $request->merge(['user_id' => $request->auth->id, 'info' => json_encode($requestData)]);

        $class = new SupplyController();
        $supply = Supply::create($request->all());
        $class->sendmail($request, $book->id);

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
                'info' => 'required'
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
        $info = $request->input('info');
        if(array_key_exists('img', json_decode($supply->info, true))){
            $info['img'] = json_decode($supply->info, true)['img'];
        }else{
            $info['img'] = [];
        }
        foreach ($request->input('img') as $key => $value) {
            if ($value['encode']) {
                $image = substr(explode(";", $value['encode'])[1], 7);
                $name = bin2hex(random_bytes(10)) . '-' . $request->auth->id . '.jpeg';
                array_push($info['img'], $name);
                file_put_contents('../../../img/' . $name, base64_decode($image));
            }
        }

        $requestData = $request->input('info');
        $requestData['img'] = $info['img'];
        $request->merge(['user_id' => $request->auth->id, 'info' => json_encode($requestData)]);

        if ($price || $info) {
            if ($supply->isDirty()) {
                $book = Book::where('id', $book)->first();
            } else {
                $book = Book::where('id', $supply->book_id)->first();
            }

            $this->validate($request, [
                'price' => 'required|numeric|between:0,' . $book->price,
                'info' => 'required'
            ]);

            //Update the name
            $supply->price = $price;
            $supply->info = $info;
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

    public function deleteImage(Request $request, $id) {
        $supply = Supply::find($id);

        if (!$supply) {
            Response()->json([], 404);
        }

        if ($request->auth->id != $supply->user_id) {
            return response()->json([
                'error' => 'You are not authorized to edit this supply.'
            ], 400);
        }

        $tmpSupply = $supply;
        $info = json_decode($supply->info, true);
        $info['img'] = json_decode(json_encode(array_diff($info['img'], [$request->input('img')])), true);
        $request->merge(['info' => json_encode($info)]);
        $supply->info = $request->info;



        try {
            $supply->save();
            if(file_exists('../../../img/' . $request->input('img'))){
                unlink('../../../img/' . $request->input('img'));
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => 'An error while updating up.' // To get the error message use this: $e->getMessage()
            ], 400);
        }

        return response()->json([
            'success' => 'Immagine rimossa con successo.'
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

    public function sendmail(Request $request, $id) {

        $book = new BookController;

        foreach ($book->getBookDemands($id) as $data) {
            $user = User::find($data->user_id);
            
            if ($user->NewSupply && $request->auth->id != $user->id) {
                Mail::to($user->email)->send(new SupplyMail($id, $request->all()));
            }

        }
    }

}