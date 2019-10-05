<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Story;
use App\Comment;
use App\User;
use App\Traits\StoryImages;
use App\Traits\CTRUtils;
use App\Traits\ProfileUtils;
use App\Contracts\AwrRestfulController;


class BlogController extends AwrAPICTR implements AwrRestfulController
{

    use StoryImages, CTRUtils, ProfileUtils;

    /**
     * Create only allowed for admins. The user_id must be specified.
     * We need to be careful with initial status value!
     */
    public function isModelRelatedToAuthenticatedUser()
    {
        return false;
    }

    public function getModel()
    {
        return Story::class;
    }

    public function onResult($res)
    {
        $res->user;
        $this->setupShortProfileResult($res->user);
        $res->share_link = '/share/' . static::encodeItemShareId($res->id, 'story');
        unset($res->user->email);
        unset($res->user->phone);
        $res->tags;
//        $res->comments;
        $res->comments_count = Comment::where('parent_id', null)->where('story_id', $res->id)->count();
        $res->reactions;
        $res->images = $this->getImageList($res->id);
        foreach ($res->reactions as $r) {
            $r->type;
            $r->user;
            $r->name = $r->type->name;
            $r->user_name = $r->user->name;
            $r->user_picture = $r->user->picture;
            $r->user_title = $r->user->title;
            unset($r->type);
            unset($r->user);
        }
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        $excludeKey = $request->query('exclude');
        $exclude = array();
        if (!empty($excludeKey)) {
            $exclude = explode(',', $excludeKey);
        }
        /*
         * We must allow exclude because in many
         * listing big data such as content column is not desired.
         * Note: in order for exclude to work the Eloquent model
         * should have scopeExclude function**/
        if (empty($key)) {
            return $this->getModel()::where('type', 'blog')
                ->where('status', 'published')
                ->exclude($exclude)
                ->get();
        } else {
            return $this->getModel()::where('type', 'blog')
                ->where('status', 'published')
                ->exclude($exclude)
                ->get();
        }

    }

    public function findOne(Request $request, $id)
    {
        return $this->getModel()::where('type', 'blog')->where('status', 'published')->where('id', $id)->first();
    }




    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'type' => 'required',
            'content_type' => 'required',
            'title' => 'required',
            'content' => 'required',
            'user_id' => 'required'
        ]);
    }

    public function updateValidator(Request $request)
    {
        /*
         * We shouldn't require the content
         * for updates as the request might be
         * about updating a status state. The
         * list items often not include the content field
         * */
        return Validator::make($request->all(), [
            'type' => 'required',
            'content_type' => 'required',
            'title' => 'required',
//            'content' => 'required',
            'user_id' => 'required'
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $item = $this->findOne($request, $id);
        if ($item && $this->additionalRemoveCheck($request, $id)) {
            $item->delete();
            $this->removeAllImages($id, true);
            return response()->json(['message' => 'item removed'], 202);
        } else {
            $err = ['message' => 'not found'];
            $err = $this->onRemoveError($request, $err, $id);
            return response()->json($err, 404);
        }
    }

}
