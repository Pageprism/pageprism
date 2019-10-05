<?php

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware('secure:api')->post('/story_image/{story_id}','StoryFileController@upload_image');
Route::middleware('secure:api')->post('/email_confirm_link','UserController@newEmailConfirmLink');
Route::middleware('secure:api')->post('/seen_notification','NotificationController@addSeenItems');
Route::get('/story_image/{story_id}/{img_name}','StoryFileController@get_image');
Route::get('/story_image_list/{story_id}','StoryFileController@get_image_list');

Route::middleware('secure:api')->post('/profile_image/','UserFileController@uploadProfileImage');
Route::get('/profile_image/{profile_key}/{img_name?}','UserFileController@getProfileImage');
Route::get('/profile_image_list/{profile_key}','UserFileController@getProfileImageList');


Route::get('/story_image_page/{encoded_id}','ResourceController@getStoryImagePage');
Route::get('/file/{encoded_id}/{file_name?}','ResourceController@getFile');
Route::middleware('secure:api')->post('/story_attachment/{story_id}','ResourceController@uploadStoryAttachment');
Route::middleware('secure:api')->post('/ps_convert/{story_id}/{pdf_id}','PSDocController@convert');

Route::middleware('secure:client')->get('/category_index','BlogIndexController@categoryIndex');
Route::middleware('secure:client')->get('/similar_stories/{story_id}','BlogIndexController@similarStories');
Route::middleware('secure:client')->get('/index','BlogIndexController@index');
Route::middleware('secure:client')->get('/search','BlogIndexController@search');
Route::middleware('secure:client')->post('/t_pulse','TrackController@pulse');
Route::middleware('secure:client')->post('/refer','ShareController@refer');
Route::middleware('secure:client')->get('/ps_autocomplete','PSearchController@autoComplete');
Route::middleware('secure:client')->get('/ps_story_search','PSearchController@storySearch');



