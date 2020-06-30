<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Response;

class ClassController extends Controller {
    public function index() {
        return SchoolClass::orderBy('name', 'ASC')->get();
    }

    public function getClass($id) {
        $class = SchoolClass::find($id);
        return $class ? $class : Response()->json([], 404);
    }

    public function getClassBooks($id) {
        $class = SchoolClass::find($id);
        return $class ? $class->books($id) : Response()->json([], 404);
    }

    public function getClassSupplies($id) {
        $class = SchoolClass::find($id);
        return $class ? $class->supplies($id) : Response()->json([], 404);
    }

    public function getClassDemands($id) {
        $class = SchoolClass::find($id);
        return $class ? $class->demands($id) : Response()->json([], 404);
    }
}
