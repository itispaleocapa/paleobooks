<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Offer;
use App\Models\SchoolClass;

class OfferController extends Controller {
    public function getList() {
        return Offer::with(['book:id,title,isbn', 'user'])->get();
    }
}
