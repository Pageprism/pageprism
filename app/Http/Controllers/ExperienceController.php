<?php

namespace App\Http\Controllers;

use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\ExperienceNotifs;
use Validator;
use Illuminate\Http\Request;
use App\User;
use App\Story;
use App\Experience;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;


class ExperienceController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }

    public function getModel()
    {
        return Experience::class;
    }

    public function onResult($res)
    {
        $res->user;
        if (!empty($res->user)) {
            unset($res->user->email);
            unset($res->user->phone);
        }
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'user_id' => 'required',
            'type' => 'required',
            'position' => 'required',
            'at' => 'required',
            'started' => 'required',
        ]);
    }

    public function getNotifs(): RestfulResourceNotifs
    {
        return new ExperienceNotifs($this->notifManager);
    }


    public function updateValidator(Request $request)
    {
        return $this->createValidator($request);
    }


    public function additionalCreateCheck(Request $request)
    {

        $user = $request->user();
        return $request['user_id'] === $user->id;
    }

    public function additionalUpdateCheck(Request $request, $id)
    {
        $item = Experience::find($id);
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
            $err['forbidden'] = 'Users are allowed to add experience entries only for their own profiles.';
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
