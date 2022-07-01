<?php

return [

   'default' => 'mysql',

   'connections' => [
        'mysql' => [
            'driver'    => 'mysql',
            'host'      => env('DB_HOST'),
            'port'      => env('DB_PORT'),
            'database'  => env('DB_DATABASE'),
            'username'  => env('DB_USERNAME'),
            'password'  => env('DB_PASSWORD'),
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
            'strict'    => false,
         ],

        'telegram' => [
            'driver'    => 'mysql',
            'host'      => env('TELEGRAM_DB_HOST'),
            'port'      => env('TELEGRAM_DB_PORT'),
            'database'  => env('TELEGRAM_DB_DATABASE'),
            'username'  => env('TELEGRAM_DB_USERNAME'),
            'password'  => env('TELEGRAM_DB_PASSWORD'),
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
            'strict'    => false,
        ],
    ],
];
?> 