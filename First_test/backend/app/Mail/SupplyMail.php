<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Http\Controllers\SupplyController;
use App\Http\Controllers\BookController;
use App\Models\Supply;


class SupplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $book_title;

    public $supply_url;

    public $user_price;

    /**
    * Create a new message instance.
    *
    * @return void
    */
    public function __construct($id, $request)
    {   
        $bookController = new  BookController();
        $book = $bookController->show($id);
        $supplies = Supply::with(['book:id,title,isbn,price,photo'])->where('user_id', $request['user_id'])->get();
        foreach ($supplies as $value) {
            if($value->book_id  === $id) {
                $supply = $value;
            }
        }
        $this->user_price = $request['price'];
        $this->supply_url = env('APP_URL').'/supply/'.$supply->id;
        $this->book_title = $bookController->show($id)->title;
    }

    /**
    * Build the message.
    *
    * @return $this
    */
    public function build()
    {

        return $this->subject('Nuova offerta per un libro che stai cercando')->view('Mail.new_supply');

    }
}