<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call('UsersTableSeeder');
        Model::unguard();
        // Register the user seeder
        $this->call(UsersTableSeeder::class);
        Model::reguard();
    }
}
