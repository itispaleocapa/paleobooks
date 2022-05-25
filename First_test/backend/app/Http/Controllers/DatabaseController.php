<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class DatabaseController extends Controller {
    public function update(Request $request){
        $token = $request->input('token');

        if (strcmp($token, env('MIGRATION_TOKEN')) !== 0) {
            return response()->json([
                'error' => 'Token is invalid.'
            ], 401);
        }

        Artisan::call('migrate', array('--path' => 'database/migrations', '--force' => true));
        return '<h1>Database updated</h1>';
    }
}