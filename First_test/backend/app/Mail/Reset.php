<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class Reset extends Mailable
{
    use Queueable, SerializesModels;

    public $reset_token;



    /**
    * Create a new message instance.
    *
    * @return void
    */
    public function __construct($reset_token)
    {
        $this->reset_token = $reset_token;
    }

    /**
    * Build the message.
    *
    * @return $this
    */
    public function build()
    {
        return $this->subject('Ripristino password')->view('Mail.password_reset');

        
    }
}