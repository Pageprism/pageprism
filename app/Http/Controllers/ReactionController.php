<?php

namespace App\Http\Controllers;


use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\ReactionNotifs;
use Log;
use Illuminate\Http\Request;
use Validator;
use App\Reaction;
use App\ReactionType;
use App\Story;
use App\Comment;
use App\User;
use App\Contracts\AwrRestfulController;


class ReactionController extends AwrAPICTR implements AwrRestfulController
{


    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }

    public function getModel()
    {
        return Reaction::class;
    }

    public function onResult($res)
    {
        $res->user;
        $res->type;

        $res->name = $res->type->name;
        $res->user_name = $res->user->name;
        $res->user_picture = $res->user->picture;
        $res->user_title = $res->user->title;
        unset($res->type);
        unset($res->user);
//        $res->story;
//        $res->comment;
    }

    public function getNotifs(): RestfulResourceNotifs
    {
        return new ReactionNotifs($this->notifManager);

    }


    /**
     *
     * @param Request $request
     * @return Reaction
     */
    public function createOne(Request $request)
    {
        $rType = ReactionType::where('name', $request['name'])->first();
        if (empty($rType)) {
            factory(ReactionType::class, 1)->create(['name' => $request['name']]);
            $rType = ReactionType::where('name', $request['name'])->first();
        }
        /*
        * Note: To add something to a Request object, do this:
        * $request->request->add(['variable', 'value']);
        * */
        $request->request->add(['reaction_type_id' => $rType->id]);
        return parent::createOne($request);
    }


    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required',
            'user_id' => 'required'
        ]);
    }

    public function updateValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required',
            'user_id' => 'required'
        ]);
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        return parent::listAll($request, ['story_id', 'comment_id', 'target_type', 'target_id']);
    }

    /**
     * Here would be nice to show enough information
     * for why it failed. The parent generic logic
     * does not cover this specific situation
     * @param Request $request
     * @param $err
     */
    public function onCreateError(Request $request, $err)
    {
        if (!$this->additionalCreateCheck($request)) {
            $err['bad reaction'] = 'The reaction mus be about an existing comment or story.' .
                ' Also The reaction should be unique for (reaction_type_id, user_id, story_id/comment_id)';
        }
        return $err;
    }

    public function onUpdateError(Request $request, $err, $id)
    {

        $err['forbidden'] = 'The update is not permitted for this resource.';
        return $err;
    }

//    public function onRemoveError(Request $request, $err, $id)
//    {
//        if (!$this->additionalRemoveCheck($request, $id)) {
//            $err['message'] = 'Item cannot be removed at this point without using force!';
//        }
//        return $err;
//    }

    public function additionalCreateCheck(Request $request)
    {
        $rType = ReactionType::where('name', $request['name'])->first();
        $user = $request->user();
        if (empty($rType)) {
            return true;
        }
        if (!empty($request['story_id'])) {
            $story = Story::find($request['story_id']);
            return !empty($story) && Reaction::where('user_id', $user->id)
                    ->where('story_id', $request['story_id'])
                    ->where('reaction_type_id', $rType->id)
                    ->count() < 1;
        }
        if (!empty($request['comment_id'])) {
            $comment = comment::find($request['comment_id']);
            return !empty($comment) && Reaction::where('user_id', $user->id)
                    ->where('comment_id', $request['comment_id'])
                    ->where('reaction_type_id', $rType->id)
                    ->count() < 1;
        }
        if (empty('comment_id') && empty('story_id')) {
            return false;
        }
        return true;
    }

    public function additionalUpdateCheck(Request $request, $id)
    {
        /*update is not allowed!*/
        return false;
    }


}
