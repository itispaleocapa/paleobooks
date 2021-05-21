<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class DatabaseController extends Controller {
    public function update(Request $request){
        Artisan::call('migrate', array('--path' => 'database/migrations', '--force' => true));
        return '<h1>Database updated</h1>';
    }
}
