<?php


namespace App\Services;


use App\User;


class EmailSenderResolver
{


    public function __construct()
    {

    }


    public function resolve()
    {

        if(env('APP_NAME') == 'Pageshare'){
            return (object)[
                'name' => 'Pageshare',
                'email' => 'hello@pageshare.fi'
            ];
        }
        return (object)[
            'name' => 'Awiar',
            'email' => 'hello@awiarsolutions.com'
        ];
    }



    private function endsWith($haystack, $needle)
    {
        $length = strlen($needle);
        if ($length == 0) {
            return true;
        }

        return (substr($haystack, -$length) === $needle);
    }
}