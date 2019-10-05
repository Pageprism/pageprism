<?php

namespace App\Http\Controllers;

use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\ProfileNotifs;
use Validator;
use Illuminate\Http\Request;
use App\User;
use App\Story;
use App\Following;
use App\Traits\CTRUtils;
use App\Traits\ProfileUtils;
use App\Contracts\AwrRestfulController;


class ProfileController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils, ProfileUtils;

    public function getModel()
    {
        return User::class;
    }

    public function getNotifs(): RestfulResourceNotifs
    {
        return new ProfileNotifs($this->notifManager);
    }


    public function onResult($res)
    {
        /*TODO: create relationship for user <---> messages*/
        //$res->messages;
        $this->setupProfileResult($res);
    }

    public function additionalUpdateCheck(Request $request, $id)
    {
        $item = User::find($id);
        $user = $request->user();
        return !empty($item) && $id == $user['id'];
    }

    public function updateValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required',
        ]);
    }

    public function onUpdateError(Request $request, $err, $id)
    {
        if (!$this->additionalUpdateCheck($request, $id)) {
            $err['forbidden'] = 'The operation is allowed only by the profile owner.';
        }
        return $err;
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        $all = collect(parent::listAll($request, $key, $value));
        $role = $request->query('role');
        if (!empty($all) && $all->count() > 0 && !empty($role)) {
            return $all->filter(function ($u) use ($role) {
                $u->roles;
                return $u->roles->map(function ($r) {
                    return $r->name;
                })->contains($role);
            })->flatten();
        }
        return $all;
    }

    public function update(Request $request, $id)
    {
        unset($request['email']);
        unset($request['title']);
        unset($request['password']);
        return parent::update($request, $id);
    }

}
