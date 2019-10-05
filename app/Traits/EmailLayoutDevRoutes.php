<?php

namespace App\Traits;

use Illuminate\Cookie\CookieJar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Traits\CTRUtils;
use App\Exchange;
use App\User;
use Illuminate\Support\Facades\Route;
use App\EmailData\StoryEmailNotifData;
use App\EmailData\StoryCmtEmailNotifData;
use App\EmailData\PSDocEmailNotifData;
use App\EmailData\InviteEmailData;

trait EmailLayoutDevRoutes
{

    static function setupRoutes()
    {

        /*
         * Email dev previews
         **/
        if (env('APP_ENV') !== 'local') {
            return;
        }

        Route::get('/ps_welcome', ['as' => 'ps_welcome', 'uses' => function (CookieJar $cookieJar, Request $request) {
            $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            return view('emails.ps.welcome', [
                'link' => 'https://pageshare.fi/confirm/aadasdasdawewasdfhg',
                'isWelcomeLink' => false,
                'server_root' => $server_root
            ]);
        }]);

        Route::get('/cmt_ntf', ['as' => 'mail', 'uses' => function (CookieJar $cookieJar, Request $request) {
            $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            return view('emails.cmt_ntf', (array)new StoryCmtEmailNotifData(User::find(1), 7, 1, false, $server_root));
        }]);

        Route::get('/socket', ['as' => 'socket', 'uses' => function (CookieJar $cookieJar, Request $request) {
            $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            return view('socket', ['server_root' => $server_root]);
        }]);

        Route::get('/new_book', ['as' => 'new_book', 'uses' => function (CookieJar $cookieJar, Request $request) {
            $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            return view('emails.ps.new_book', (array)new PSDocEmailNotifData(42, $server_root));
        }]);

        Route::get('/convert_ready', ['as' => 'convert_ready', 'uses' => function (CookieJar $cookieJar, Request $request) {
            $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            return view('emails.ps.convert_ready', (array)new PSDocEmailNotifData(42, $server_root));
        }]);

        Route::get('/invite', ['as' => 'ps_invite', 'uses' => function (CookieJar $cookieJar, Request $request) {
            $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            return view('emails.ps.invite', (array)new InviteEmailData(\App\invite::find(8), $server_root));
        }]);

        Route::get('/joined', ['as' => 'joined_email', 'uses' => function (CookieJar $cookieJar, Request $request) {
            $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            return view('emails.ps.person_joined', ['person' => User::find(4), 'server_root' => $server_root]);
        }]);

        Route::get('/mail', ['as' => 'mail', 'uses' => function (CookieJar $cookieJar, Request $request) {
            $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            $user = User::find(1);
            $exchange = new Exchange();
            $exchange->fill([
                'key' => uniqid($user->id . '_'),
                'value' => $user->email,
                'type' => 'confirm_email'
            ]);
            $exchange->save();
            $link = $server_root . '/confirm/email/' . CTRUtils::encodeItemShareId($exchange->key, $user->id);

            return view('emails.welcome', ['link' => $link, 'isWelcomeLink' => false]);
        }]);

        Route::get('/password', ['as' => 'password_reset', 'uses' => function (CookieJar $cookieJar, Request $request) {
            $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            $user = User::find(1);
            $exchange = new Exchange();
            $exchange->fill([
                'key' => uniqid($user->id . '_'),
                'value' => $user->email,
                'type' => 'password_reset'
            ]);
            $exchange->save();
            $key = CTRUtils::encodeItemShareId($exchange->key, $user->id);
            $link = $server_root . '/insider/#resets/password/' . $key;
            $cancel_link = $server_root . '/cancel/r/p/' . $key;
            return view('emails.ps.password_reset', [
                'link' => $link, 'cancel_link' => $cancel_link,
                'isWelcomeLink' => false,
                'server_root' => $server_root
            ]);

        }]);
    }

}