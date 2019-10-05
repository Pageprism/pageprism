<?php

namespace App\Http\Controllers;

use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\SocialLinkNotifs;
use Validator;
use Illuminate\Http\Request;
use App\Tag;
use App\SocialLink;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;


class SocialLinkController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    public function getNotifs(): RestfulResourceNotifs
    {
        return new SocialLinkNotifs($this->notifManager);
    }

    public function getModel()
    {
        return SocialLink::class;
    }

    public function onResult($res)
    {
        $res->user;
        if (!empty($res->user)) {
            unset($res->user->email);
            unset($res->user->phone);
        }
    }

    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'user_id' => 'required',
            'name' => 'required',
            'url' => 'required'
        ]);
    }

    public function updateValidator(Request $request)
    {
        return $this->createValidator($request);
    }

    public function additionalCreateCheck(Request $request)
    {

        $user = $request->user();
        $name = $request['name'];
        $user_id = $request['user_id'];
        $exists = SocialLink::where('user_id', $user_id)
                ->where('name', $name)
                ->get()
                ->count() > 0;
        return $request['user_id'] === $user->id && !$exists;
    }

    public function additionalUpdateCheck(Request $request, $id)
    {
        $item = SocialLink::find($id);
        $user = $request->user();
        return $item->user_id === $user->id;
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        return $this->additionalUpdateCheck($request, $id);
    }

    public function onCreateError(Request $request, $err)
    {
        if (!$this->additionalCreateCheck($request)) {
            $err['forbidden'] = 'Users are allowed to add social links only for their own profiles. ';
            $err['note'] = 'Each social link can be added only once.';
        }
        return $err;
    }

    public function onUpdateError(Request $request, $err, $id)
    {
        if (!$this->additionalUpdateCheck($request, $id)) {
            $err['forbidden'] = 'The operation is allowed only by the profile owner.';
        }
        return $err;
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        return $this->onUpdateError($request, $err, $id);
    }
}
