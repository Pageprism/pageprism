<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use \App\Story;
use \App\Tag;
use App\Traits\BlogIndexUtils;
use App\Traits\StoryImages;
use App\Traits\CTRUtils;
use App\Traits\ProfileUtils;


class BlogIndexController extends Controller
{
    //
    use CTRUtils, BlogIndexUtils, StoryImages, ProfileUtils;

    /**
     *
     * The response body structure will be as following:
     *
     * {
     *   top_categories:['most famous categories'],
     *   user_top_tags:['tags which user / device is interested in'],
     *   cover_story:{'The featured article in this category'}
     *   continue_reading:['list of unfinished reads by user / device']
     *   top:['A set including most popular articles in the category']
     *   recommended:['A set of recommended articles for the category']
     *   latest:['The recent articles in the category']
     * }
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user_id = $request->query('user_id');
        $device_session_id = $request->query('device_session_id');

        $indexResponse = $this->createIndexResponse($user_id, $device_session_id);

        return response()->json($indexResponse, 200);
    }

    public function categoryIndex(Request $request)
    {
        $category = $request->query('category');
        $limit = $request->query('limit');
        $user_id = $request->query('user_id');
        $device_session_id = $request->query('device_session_id');
        $indexResponse = $this->createCategoryIndexResponse($category, $limit, $user_id, $device_session_id);
        return response()->json($indexResponse, 200);
    }

    public function similarStories(Request $request, $story_id)
    {
        $user_id = $request->query('user_id');
        $device_session_id = $request->query('device_session_id');
        $indexResponse = $this->getSimilarStories($story_id, $user_id, $device_session_id);
        return response()->json($indexResponse, 200);
    }

    public function search(Request $request)
    {
        /*
         * we should take the query from the URL
         * attribute instead of path param. The reason
         * is that the attributes allow more flexibility
         * as we can encode them in client side
         * using functions like "encodeURIComponent",
         * and therefore the query string can
         * freely include any arbitrary character.
         * */
        $query = $request->query('query');
        /*we add paging support for search in future*/
        $page = $request->query('page');
        $limit = $request->query('limit');
        $user_id = $request->query('user_id');
        $device_session_id = $request->query('device_session_id');
        $res = $this->createSearchResponse($query, is_numeric($limit) ? $limit : 100, $user_id, $device_session_id);

        return response()->json($res, 200);
    }


}
