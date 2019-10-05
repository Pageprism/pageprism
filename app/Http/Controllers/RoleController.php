<?php

namespace App\Http\Controllers;

use App\Contracts\NotifManager;
use App\Role;
use App\RoleUser;
use App\Services\RoleHelper;
use App\User;
use Illuminate\Http\Request;
use Validator;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use App\Services\AwrCTRHelper;


class RoleController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    /**
     * @var RoleHelper
     */
    protected $roleHelper;

    /**
     * RoleController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param RoleHelper $roleHelper
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper, RoleHelper $roleHelper)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->roleHelper = $roleHelper;
    }

    public function isModelRelatedToAuthenticatedUser()
    {
        return false;
    }

    public function getModel()
    {
        return RoleUser::class;
    }

    public function onResult($res)
    {
        $res->user;
        $res->role;
        $res->name = $res->role->name;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'user_id' => 'required',
            'name' => 'required'
        ]);
    }

    public function additionalCreateCheck(Request $request)
    {
        $data = $request->all();
        $editUser = $request->user();
        $second = User::find($data['user_id']);
        if (empty($second)) {
            return true;
        }
        $role = $this->roleHelper->getRole($data['name']);
        /*
        * Use must be able to share the role, this will prevent user from
        * giving himself and others higher roles than he/she holds currently.
        * For example an admin cannot upgrade himself to a super user!
        * */
        if(!$this->roleHelper->isUserAllowedToShareRole($editUser,$role)){
            return false;
        }

        return $this->roleHelper->firstCanEditSecondsRoles($editUser, $second);
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        $editUser = $request->user();
        $item = RoleUser::find($id);
        if (empty($item) || empty($item->user)) {
            return true;
        }
        return $this->roleHelper->firstCanEditSecondsRoles($editUser, $item->user);
    }

    public function onCreateError(Request $request, $err)
    {
        if (!$this->additionalCreateCheck($request)) {
            $err['message'] = 'Not enough privileges to give this role to this user.';
        }
        return $err;
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        if (!$this->additionalRemoveCheck($request, $id)) {
            $err['message'] = 'Not enough privileges to revoke a role from this user.';
        }
        return $err;
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        /*limit to the roles of one user*/
        return parent::listAll($request, ['user_id'], $value);
    }

    public function createOne(Request $request)
    {
        $data = $request->all();
        $role = $this->roleHelper->getRole($data['name']);
        $roleUser = $this->roleHelper->getRoleUser($data['user_id'], $role->id);
        return $roleUser;
    }

}
