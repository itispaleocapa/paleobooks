<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Response;

class ClassController extends Controller {
    public function getList() {
        return SchoolClass::all();
    }

    public function getClass($id) {
        $class = SchoolClass::find($id);
        return $class ? $class : Response()->json([], 404);
    }

    public function getClassBooks($id) {
        $class = SchoolClass::find($id);
        return $class ? $class->books : Response()->json([], 404);
    }
}
