<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Models\Supply;
use App\Models\Demand;

class AppController extends Controller {
    public function getInfo(Request $request) {
        $user = User::find($request->auth->id);
        
        $supplies = Supply::count();
        $demands = Demand::count();
        $user_supplies = Supply::where('user_id', $user->id)->count();
        $user_demands = Demand::where('user_id', $user->id)->count();

        return response()->json([
            'supplies' => $supplies,
            'demands' => $demands,
            'user_supplies' => $user_supplies,
            'user_demands' => $user_demands,
        ], 200);
    }
}
