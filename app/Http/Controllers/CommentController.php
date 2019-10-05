<?php

namespace App\Http\Controllers;

use App\Adapters\RestfulNotifsAdapter;
use App\Contracts\RestfulResourceNotifs;
use App\Contracts\NotifManager;
use App\ResourceNotifs\CommentNotifs;
use Illuminate\Http\Request;
use Validator;
use App\Story;
use App\Comment;
use App\User;
use App\Contracts\AwrRestfulController;
use Illuminate\Database\Eloquent\Model;


class CommentController extends AwrAPICTR implements AwrRestfulController
{
    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }

    public function getModel()
    {
        return Comment::class;
    }

    public function onResult($res)
    {
        $res->user;
        unset($res->user->email);
        unset($res->user->phone);
        $res->replies;
        $res->reactions;
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

    public function getNotifs(): RestfulResourceNotifs
    {
        return new CommentNotifs($this->notifManager);
    }


    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'content' => 'required',
            'content_type' => 'required',
            'user_id' => 'required',
            'story_id' => 'required'
        ]);
    }

    public function updateValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'content' => 'required',
            'content_type' => 'required',
            'user_id' => 'required',
            'story_id' => 'required'
        ]);
    }

    public function listAll(Request $request, $key = null, $value = null)
    {

        $storyId = $request->query('story_id', null);
        /*listing only top level comments and replies will be set on each top level comment*/
        if (empty($storyId)) {
            return parent::listAll($request, 'parent_id', null);
        }

        return $this->getModel()::where('parent_id', null)->where('story_id', $storyId)->get();

    }

}
