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
    // Guest accessible requests
    $router->group(['middleware' => 'guest.auth'], function () use ($router) {
        $router->post(
            'login', ['uses' => 'AuthController@authenticate']
        );
    
        $router->post(
            'register', ['uses' => 'AuthController@register']
        );
    
        $router->post(
            'paleoid', ['uses' => 'AuthController@authenticatePaleoID']
        );

        $router->group(['prefix' => 'password-reset'], function () use ($router) {
            $router->post(
                '/', ['uses' => 'AuthController@sendResetPassword']
            );
    
            $router->post(
                '/{token}', ['uses' => 'AuthController@resetPassword']
            );
        });
    });

    $router->group(['middleware' => 'jwt.refresh'], function () use ($router) {
        $router->post(
            'refresh-token', ['uses' => 'AuthController@refreshToken']
        );
    });
    
    $router->group(['middleware' => 'jwt.auth'], function() use ($router) {
        $router->post(
            '/logout', ['uses' => 'AuthController@logout'] 
        );
    });
});

$router->group(
    ['middleware' => 'jwt.auth'],
    function() use ($router) {
        // PALEObooks app info
        $router->get('/app/info', 'AppController@getInfo');

        $router->group(['prefix' => 'users'], function () use ($router) {
            $router->get('/profile', 'UserController@show');
            $router->put('/', 'UserController@update');
        });

        $router->group(['prefix' => 'classes'], function () use ($router) {
            $router->get('/', 'ClassController@index');
            // $router->get('/{id}', 'ClassController@getClass');
            $router->get('/{id}/books', 'ClassController@getClassBooks');
            $router->get('/{id}/supplies', 'ClassController@getClassSupplies');
            $router->get('/{id}/demands', 'ClassController@getClassDemands');
        });

        $router->group(['prefix' => 'books'], function () use ($router) {
            $router->get('/', 'BookController@index'); // Can add 'search' param in header request to filter by title or isbn
            $router->get('/{id}', 'BookController@show');
            $router->get('/{id}/supplies', 'BookController@getBookSupplies');
            $router->get('/{id}/demands', 'BookController@getBookDemands');
        });

        // This route could contains optional parameters
        //$router->get('/supplies[/{filter}]', 'SupplyController@index');
        $router->group(['prefix' => 'supplies'], function () use ($router) {
            $router->get('/', 'SupplyController@index');
			$router->get('/user', 'SupplyController@getUserSupplies');
            $router->get('/{id}', 'SupplyController@show');
            $router->post('/', 'SupplyController@create');
            $router->put('/{id}', 'SupplyController@update');
            $router->delete('/{id}', 'SupplyController@destroy');
        });

        $router->group(['prefix' => 'demands'], function () use ($router) {
            $router->get('/', 'DemandController@index');
			$router->get('/user', 'DemandController@getUserDemands');
            $router->get('/{id}', 'DemandController@show');
            $router->post('/', 'DemandController@create');
            $router->put('/{id}', 'DemandController@update');
            $router->delete('/{id}', 'DemandController@destroy');
        });
    }
);

// Automatic update database with Laravel migrations
$router->group(['prefix' => 'database'], function () use ($router){
    $router->get('/update', 'DatabaseController@update');
});
