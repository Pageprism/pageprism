<?php

namespace App\Http\Controllers;

use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\MyBlogNotifs;
use Illuminate\Http\Request;
use Validator;
use App\Story;
use App\Comment;
use App\Traits\StoryImages;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;


class MyBlogController extends AwrAPICTR implements AwrRestfulController
{
    use StoryImages, CTRUtils;

    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }

    public function getModel()
    {
        return Story::class;
    }

    public function getNotifs(): RestfulResourceNotifs
    {
        return new MyBlogNotifs($this->notifManager);
    }


    public function onResult($res)
    {
        $res->user;
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
        $user = $request->user();
        $status = $request->query('status');
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
        if (!empty($status)) {
            return $this->getModel()::where('type', 'blog')
                ->where('user_id', $user['id'])
                ->where('status', $status)
                ->exclude($exclude)
                ->get();
        } else {
            return $this->getModel()::where('type', 'blog')
                ->where('user_id', $user['id'])
                ->exclude($exclude)
                ->get();
        }

    }

    public function findOne(Request $request, $id)
    {
        $user = $request->user();
        return $this->getModel()::where('user_id', $user['id'])->where('id', $id)->first();
    }


    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'type' => 'required',
            'content_type' => 'required',
            'title' => 'required',
            'content' => 'required'
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
//            'type' => 'required',
//            'content_type' => 'required',
//            'title' => 'required',
//            'content' => 'required'
        ]);

    }


    public function additionalUpdateCheck(Request $request, $id)
    {
        $user = $request->user();
        $item = Story::find($id);
        return !(empty($item) || empty($user)) && ($this->isUserAdmin($user) || $item->user_id === $user['id']);
    }


    /**
     * @param Request $request
     * @param $id
     * @return bool
     */
    public function additionalRemoveCheck(Request $request, $id)
    {
        return $this->additionalUpdateCheck($request, $id);
    }

    /**
     *
     * Here would be nice to show enough information
     * for why it failed. The parent generic logic
     * does not cover this specific situation.
     * @param Request $request
     * @param $err
     * @param $id
     * @return mixed
     */
    public function onUpdateError(Request $request, $err, $id)
    {
        if (!$this->additionalUpdateCheck($request, $id)) {
            $err['forbidden'] = 'The operation is not allowed for current user.';
        }
        return $err;
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        return $this->onUpdateError($request, $err, $id);
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
