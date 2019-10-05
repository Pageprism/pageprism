<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\Route;
use App\Traits\EmailLayoutDevRoutes;

//unlH0OzhvwkWB3fzG2JCL0bpN6LhnvqHHd9DD0OZ
Route::group(['middleware' => ['web']], function () {

    //Your route here
    Route::get('/', [
        'as' => 'home',
        'uses' => 'WebController@home'
    ]);

    //supporting incoming auth (IN) links
    Route::get('/in/{any}', [
        'as' => 'home-in-links',
        'uses' => 'WebController@home'
    ])->where('any', '.*');


    Route::get('/v/{title?}/{docId?}/{page?}', [
        'as' => 'ps_read_doc',
        'uses' => 'WebController@home'
    ]);

    Route::get('/controls/{section?}', [
        'as' => 'ps_controls',
        'uses' => 'WebController@home'
    ]);

    Route::get('/my_collections/{id?}', [
        'as' => 'ps_my_collections',
        'uses' => 'WebController@home'
    ]);

    Route::get('/my_publisher/{id?}', [
        'as' => 'ps_my_publisher',
        'uses' => 'WebController@home'
    ]);

    Route::get('/upload/{cId?}', [
        'as' => 'ps_upload',
        'uses' => 'WebController@home'
    ]);

    Route::get('/edit/{docId?}', [
        'as' => 'ps_edit',
        'uses' => 'WebController@home'
    ]);

    Route::get('/errors/{errCode?}', [
        'as' => 'ps_errors',
        'uses' => 'WebController@home'
    ]);

    Route::get('/insider', [
        'as' => 'insider',
        'uses' => 'WebController@insider'
    ]);

    Route::get('/insider/auth', [
        'as' => 'insider_auth',
        'uses' => 'WebController@insider'
    ]);

    Route::get('/insider/forgot/{type?}', [
        'as' => 'insider_forgot',
        'uses' => 'WebController@insider'
    ]);

    Route::get('/insider/resets/{type?}/{key?}', [
        'as' => 'insider_resets',
        'uses' => 'WebController@insider'
    ]);

    Route::get('/insider/email-confirm', [
        'as' => 'insider_email_confirm',
        'uses' => 'WebController@insider'
    ]);

    Route::get('/insider/{any}', function ($any) {
        // any other url, sub folders also
        return redirect()->route('insider');
    })->where('any', '.*');

    Route::get('/read', [
        'as' => 'read',
        'uses' => 'WebController@read'
    ]);

    //supporting incoming auth (IN) links
    Route::get('/read/in/{any}', [
        'as' => 'read-in-links',
        'uses' => 'WebController@read'
    ])->where('any', '.*');

    Route::get('/profile', [
        'as' => 'profile',
        'uses' => 'WebController@profile'
    ]);

    //supporting incoming auth (IN) links
    Route::get('/profile/in/{any}', [
        'as' => 'profile-in-links',
        'uses' => 'WebController@profile'
    ])->where('any', '.*');

    Route::get('/login', [
        'as' => 'login',
        'uses' => 'AuthController@getLogin'
    ]);

    Route::get('/share/{key}', [
        'as' => 'share',
        'uses' => 'ShareController@show'
    ]);

    Route::get('/page/{title}/{key}/{pn?}', [
        'as' => 'ps_share',
        'uses' => 'ShareController@psShow'
    ]);

    Route::get('/unauthorized', [
        'as' => 'unauthorized',
        'uses' => 'WebController@unauthorized'
    ]);

    Route::get('/unsubscribe/{userKey}/{chainNameKey}/{subscriptionKey}', [
        'as' => 'unsubscribe',
        'uses' => 'SubscriptionController@unsubscribe'
    ]);
});


