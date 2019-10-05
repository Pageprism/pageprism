<?php

namespace App\Http\Controllers;

use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\FollowingNotifs;
use Validator;
use Illuminate\Http\Request;
use App\User;
use App\Tag;
use App\Following;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;


class FollowingController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    public function getNotifs(): RestfulResourceNotifs
    {
        return new FollowingNotifs($this->notifManager);
    }

    public function getModel()
    {
        return Following::class;
    }

    public function onResult($res)
    {
        $res->follower;
        $res->followed;

        if (!empty($res->follower)) {
            unset($res->follower->email);
            unset($res->follower->phone);
        }

        if (!empty($res->followed)) {
            unset($res->followed->email);
            unset($res->followed->phone);
        }
    }

//    public function createOne(Request $request)
//    {
//        $item = new Following();
//        $item->fill($request->all());
//        $item->save();
//        return $item;
//    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'follower_id' => 'required',
            'followed_id' => 'required'
        ]);
    }

    public function updateValidator(Request $request)
    {
        return $this->createValidator($request);
    }

    public function additionalCreateCheck(Request $request)
    {
        $user = $request->user();
        $follower_id = $request['follower_id'];
        $exists = Following::where('follower_id', $follower_id)
                ->where('followed_id', $request['followed_id'])->count() > 0;
        return $follower_id == $user['id'] && !$exists;
    }


    public function additionalRemoveCheck(Request $request, $id)
    {
        $user = $request->user();
        $item = Following::find($id);

        return !empty($item) && $item->follower_id == $user['id'];
    }

    public function onCreateError(Request $request, $err)
    {
        if (!$this->additionalCreateCheck($request)) {
            $err['forbidden'] = 'Users are allowed to add skill entries only for their own profiles. ';
            $err['note'] = 'Each skill can be added only once.';
        }
        return $err;
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        $item = Following::find($id);
        if (empty($item)) {
            $err['message'] = 'No following item found for removal. ';
        } else if (!$this->additionalCreateCheck($request)) {
            $err['forbidden'] = 'Users are allowed to change following settings for themselves only. ';
        }
        return $err;
    }


}
