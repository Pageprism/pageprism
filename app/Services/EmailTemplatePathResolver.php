<?php


namespace App\Services;




class EmailTemplatePathResolver
{


    public function __construct()
    {

    }


    public function getConfirmTplPath()
    {
        if (env('APP_NAME') == 'Pageshare') {
            return 'emails.ps.welcome';
        }
        return 'emails.welcome';
    }

    public function getPassResetTplPath()
    {
        if (env('APP_NAME') == 'Pageshare') {
            return 'emails.ps.password_reset';
        }
        return 'emails.password_reset';
    }

    public function getPersonJoinedTplPath()
    {
        if (env('APP_NAME') == 'Pageshare') {
            return 'emails.ps.person_joined';
        }
        return 'emails.person_joined';
    }
}