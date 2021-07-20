<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function show(Request $request) {
        $user = User::find($request->auth->id);
        return $user ? $user : Response()->json([], 404);
    }

    public function update(Request $request) {
        $user = User::find($request->auth->id);

        $user->NewSupply = $request->NewSupply;

        if ($user->password === "paleoid") {
            return response()->json([
                'error' => 'Authentication managed by PaleoID.'
            ], 400);
        }

        // Check and validate the updated name
        $name = $request->input('name');
        if ($name) {
            $this->validate($request, [
                'name' => 'required',
            ]);

            //Update the name
            $user->name = $name;
        }

        // Check and validate the updated email
        $email = $request->input('email');
        // Check if email is different from what is setted now
        if ($email && $email != $user->email) {
            $this->validate($request, [
                'email' => 'required|email',
            ]);

            // Check if the email already exists
            $check_email = User::where('email', $email)->first();
            // Return error if true
            if ($check_email) {
                return response()->json([
                    'error' => 'Email already exists.'
                ], 400);
            }

            //Update the email
            $user->email = $email;
        }

        // Check and validate the updated password
        $password = $request->input('password');
        if ($password) {
            $this->validate($request, [
                'password' => 'required',
            ]);

            // Hash the password
            $hashed_password = Hash::make($password);

            //Update the password
            $user->password = $hashed_password;
        }

        if ($user->isDirty()) {
            try {
                $user->save();
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
            'success' => $request->NewSupply
        ], 201);
    }
}
