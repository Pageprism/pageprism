<?php

namespace App\Http\Controllers;

class AuthController extends Controller
{
    //

    public function getRegister()
    {

    }

    public function postRegister()
    {

    }

    public function getLogin()
    {
        return view('not_allowed');
    }

    public function postLogin()
    {

    }

    public function unauthorized()
    {
        return view('unauthorized');
    }
}






