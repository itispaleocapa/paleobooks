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

    public function update() {
        return 'to be implemented';
    }
}