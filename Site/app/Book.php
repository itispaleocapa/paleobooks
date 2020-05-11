<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $table = 'sites';

    protected $fillable = [
        'title',
        'description',
    ];
}
