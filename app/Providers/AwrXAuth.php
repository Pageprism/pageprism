<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

class AwrXAuth
{

//"client_id":"3",
//"client_secret":"Pb7DVyEmHsJAFxJf8fcGz2pWwUYoeDaZjyv4BNKS",

    public static function routes()
    {
        /*
         * The middleware recognize_own_clients will include client_id and
         * client_secret if it is missing from a request which is from a trusted client!
         *
         * The xauth middleware group enables access to the session state, similar to
         * the web middleware but with exclusion of many middleware from web group. Without
         * xauth middleware group the recognize_own_clients will not be able to verify the X-CRF-TOKEN
         * and it will throw an session set exception!
         * **/
        $groupOneOptions = [
            'prefix' => 'xauth',
            'middleware' => ['secure:client']
        ];
        $groupTwoOptions = [
            'prefix' => 'xauth',
            'namespace' => '\App\Http\Controllers',
            'middleware' => ['secure:api']
        ];

        Route::get('/confirm/email/{key}', ['as' => 'email_confirm',
            'uses' => '\App\Http\Controllers\AwrXAuthController@confirmEmail']);
        /**
         * canceling password reset link
         */
        Route::get('/cancel/r/p/{key}', ['as' => 'cancel_password_reset',
            'uses' => '\App\Http\Controllers\AwrXAuthController@cancelPasswordReset']);

        Route::group($groupOneOptions, function ($router) {
            /*letting the Passport library handle the token generation*/
            $router->post('/token', [
                'uses' => '\Laravel\Passport\Http\Controllers\AccessTokenController@issueToken',
                'middleware' => ['throttle:200,1','add_token_exchange_key']
            ]);
            /*for registering new user*/
            $router->post('/user', [
                'uses' => '\App\Http\Controllers\UserController@store'
            ]);

            $router->post('/email_available', [
                'uses' => '\App\Http\Controllers\AwrXAuthController@emailAvailable'
            ]);

            $router->post('/check_password_reset_key', [
                'uses' => '\App\Http\Controllers\AwrXAuthController@checkPasswordResetKey'
            ]);

            $router->post('/password_reset', [
                'uses' => '\App\Http\Controllers\AwrXAuthController@passwordReset'
            ]);

            $router->post('/password_reset_link', [
                'uses' => '\App\Http\Controllers\AwrXAuthController@passwordResetLink'
            ]);

            $router->post('/token_exchange', [
                'uses' => '\App\Http\Controllers\AwrXAuthController@tokenExchange'
            ]);
        });


        Route::group($groupTwoOptions, function ($router) {
            $router->delete('/token', [
                'uses' => 'AwrXAuthController@destroy'
            ]);

            $router->post('/check_password', [
                'uses' => 'AwrXAuthController@checkPassword'
            ]);

            $router->post('/change_email', [
                'uses' => 'AwrXAuthController@changeEmail'
            ]);

            $router->post('/change_password', [
                'uses' => 'AwrXAuthController@changePassword'
            ]);

            $router->get('/token', [
                'uses' => 'AwrXAuthController@forUser'
            ]);

            $router->get('/token_user', [
                'middleware' => 'include_socket_token',
                'uses' => 'AwrXAuthController@tokenUser'
            ]);

            $router->post('/make_exchange', [
                'uses' => 'AwrXAuthController@makeExchange'
            ]);

            /*allow updating of user info by the user itself*/
            /*TODO: create a middleware that checks the update_user.id === token_user.id*/
            $router->put('/user', [
                'uses' => 'UserController@update'
            ]);
        });

    }

}