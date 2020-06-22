<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

use App\Models\Book;
use App\Models\SchoolClass;

/** @var $router */

$router->group(['prefix' => 'auth'], function () use ($router) {
    $router->post(
        'login', ['uses' => 'AuthController@authenticate']
    );

    $router->post(
        'register', 
        ['uses' => 'AuthController@register']
    );
});

$router->group(
    ['middleware' => 'jwt.auth'], 
    function() use ($router) {
        $router->group(['prefix' => 'users'], function () use ($router) {
            $router->get('/profile', 'UserController@show');
        });

        $router->group(['prefix' => 'classes'], function () use ($router) {
            $router->get('/', 'ClassController@getList');
            $router->get('/{id}', 'ClassController@getClass');
            $router->get('/{id}/books', 'ClassController@getClassBooks');
        });

        $router->group(['prefix' => 'books'], function () use ($router) {
            $router->get('/', 'BookController@getList');
            $router->get('/{id}', 'BookController@getBook');
            $router->get('/{id}/classes', 'BookController@getBookClasses');
            $router->get('/user', 'BookController@user');
        });

        $router->group(['prefix' => 'offers'], function () use ($router) {
            $router->get('/', 'OfferController@getList');
            $router->post('/', 'OfferController@create');
        });
    }
);
