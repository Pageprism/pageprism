<?php

namespace App\Http\Controllers;

use App\Contracts\NotifManager;
use App\PSPublisher;
use App\PSPublisherRole;
use App\PSPublisherRoleUser;
use App\Services\PSRoleHelper;
use App\User;
use Illuminate\Http\Request;
use Validator;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use App\Services\AwrCTRHelper;


class PSPublisherRoleController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    /**
     * @var PSRoleHelper
     */
    protected $roleHelper;

    /**
     * PSPublisherRoleController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param PSRoleHelper $roleHelper
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper, PSRoleHelper $roleHelper)
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
        return PSPublisherRoleUser::class;
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
            'publisher_id' => 'required',
            'name' => 'required'
        ]);
    }

    public function additionalCreateCheck(Request $request)
    {
        $data = $request->all();
        $editUser = $request->user();
        $user = User::find($data['user_id']);
        $publisher = PSPublisher::find($data['publisher_id']);

        return !(empty($user) || empty($publisher)) &&
            $this->roleHelper->userHasModeratorPrivileges($editUser, $publisher);
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        $editUser = $request->user();
        $item = PSPublisherRoleUser::find($id);
        if (empty($item)) {
            return true;
        }
        $role = $item->role;
        if (empty($role) || empty($role->publisher)) {
            return true;
        }
        return $this->roleHelper->userHasModeratorPrivileges($editUser, $role->publisher);
    }

    public function onCreateError(Request $request, $err)
    {
        if (!$this->additionalCreateCheck($request)) {
            $err['message'] = 'User and Publisher must exist in the system.';
            $err['note'] = 'Moderator privileges, for publisher, are needed for performing this action.';
        }
        return $err;
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        if (!$this->additionalRemoveCheck($request, $id)) {
            $err['message'] = 'Not enough privileges to remove a user with role from publisher';
        }
        return $err;
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        /*limit user's own organizations only if specified in the params*/
        return parent::listAll($request, ['user_id'], $value);
    }

    public function createOne(Request $request)
    {
        $data = $request->all();
        $role = $this->roleHelper->getRole($data['name'], $data['publisher_id']);
        $roleUser = $this->roleHelper->getRoleUser($data['user_id'], $role->id);
        return $roleUser;
    }

}
