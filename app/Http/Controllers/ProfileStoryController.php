<?php

namespace App\Http\Controllers;

use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\ProfileStoryNotifs;
use Validator;
use Illuminate\Http\Request;
use App\User;
use App\Story;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;


class ProfileStoryController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

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
        return new ProfileStoryNotifs($this->notifManager);
    }


    public function onResult($res)
    {
        /*TODO: create relationship for user <---> messages*/
        //$res->messages;
        $res->user;
        $res->reviews = $res->comments;
        $res->reactions;
        unset($res->comments);
        unset($res->user->email);
        unset($res->user->phone);
        //$res->contact_replies;
        //$res->notifications;
    }

    public function additionalUpdateCheck(Request $request, $id)
    {
        $item = Story::find($id);
        $user = $request->user();
        return $item->user_id === $user['id'] && $request->type === "profile_story";
    }

    public function onUpdateError(Request $request, $err, $id)
    {
        if (!$this->additionalUpdateCheck($request, $id)) {
            $err['forbidden'] = 'The operation is allowed only by the profile owner. Also the resource type must remain always as \'profile_story\' .';
        }
        return $err;
    }
}
