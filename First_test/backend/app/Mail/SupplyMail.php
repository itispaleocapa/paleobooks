<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Http\Controllers\SupplyController;
use App\Http\Controllers\BookController;

class SupplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $book_title;

    public $user_price;

    public $description;



    /**
    * Create a new message instance.
    *
    * @return void
    */
    public function __construct($id, $request)
    {   
        $bookController = new  BookController();
        // $book = $bookController->show($request, $id);

        // $this->t

        // print_r($request['info'][0]);

        // $this->user_price = $request['price'];

        // $this->description = json_decode($request['info'])['description'];

        $this->book_title = $bookController->show($id)->title;


    }

    /**
    * Build the message.
    *
    * @return $this
    */
    public function build()
    {

        return $this->view('Mail.new_supply');

        
    }
}