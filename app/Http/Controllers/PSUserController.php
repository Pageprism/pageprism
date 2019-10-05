<?php

namespace App\Http\Controllers;

use App\Contracts\NotifManager;
use App\Services\AwrCTRHelper;
use App\Services\PSDocService;
use App\Services\RoleHelper;
use App\Services\PSRoleHelper;
use App\Services\CanUser;
use Illuminate\Http\Request;
use App\User;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use Illuminate\Support\Facades\Validator;


class PSUserController extends AwrAPICTR implements AwrRestfulController
{

    use CTRUtils;

    /**
     * @var RoleHelper
     */
    protected $roleHelper;

    /**
     * @var PSRoleHelper
     */
    protected $psRoleHelper;

    /**
     * @var CanUser
     */
    protected $canUser;

    /**
     * @var PSDocService
     */
    protected $docService;

    /**
     * PSUserController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param RoleHelper $roleHelper
     * @param PSRoleHelper $psRoleHelper
     * @param CanUser $canUser
     * @param PSDocService $docService
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper,
                                RoleHelper $roleHelper, PSRoleHelper $psRoleHelper,
                                CanUser $canUser, PSDocService $docService)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->roleHelper = $roleHelper;
        $this->psRoleHelper = $psRoleHelper;
        $this->canUser = $canUser;
        $this->docService = $docService;
    }


    public function isModelRelatedToAuthenticatedUser()
    {
        return false;
    }

    public function getModel()
    {
        return User::class;
    }

    public function onResult($res)
    {

        /*TODO: create relationship for user <---> messages*/
        //$res->messages;
        $res->roles;
        $res->setupMainSeries();
        //$res->contact_replies;
        //$res->notifications;
        $user = !empty($this->request) ? $this->request->user() : null;
        if (empty($user) || !(
                $this->roleHelper->isPSAdminOrHigher($user) ||
                $this->psRoleHelper->areCoworkers($user, $res)
            )) {
            unset($res->email);
            unset($res->phone);
            $res->email = '< hidden >';
            $res->phone = '< hidden >';
        }
        $res->roles = $this->roleHelper->convertUserRoles($res);
    }


    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required'
        ]);
    }

    public function updateValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email'
        ]);
    }

    public function additionalCreateCheck(Request $request)
    {
        $data = $request->all();
        $existingEmail = User::where('email', $data['email'])->count();
        return $existingEmail < 1;
    }

    public function onCreateError(Request $request, $err)
    {
        if (!$this->additionalCreateCheck($request)) {
            $err['forbidden'] = 'The email is already taken by other user.';
        }
        return $err;
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        $user = $request->user();
        $account = User::find($id);
        return empty($account) || $this->canUser->removeUserAccount($user, $account);
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        if (!$this->additionalRemoveCheck($request, $id)) {
            $err['forbidden'] = 'Not enough privileges for removing user accounts.';
        }
        return $err;
    }

    /**
     * We need to provide our own createOne for hashing the password
     * @param Request $request
     * @return mixed
     */
    public function createOne(Request $request)
    {
        $user = new User();
        $data = $request->all();
        $data['password'] = bcrypt($data['password']);
        $user->fill($data);
        $user->save();
        return $user;
    }

    public function removeOne(Request $request, $id)
    {
        $user = User::find($id);
        if (empty($user)) {
            return;
        }
        $user->ownPublishers->each(function ($pub) {
            $pub->collections->each(function ($coll) {
                $this->docService->removeCollection($coll->id);
            });
            $pub->delete();
        });

        $user->collections->each(function ($coll) {
            $this->docService->removeCollection($coll->id);
        });

        $user->stories->each(function ($story) {
            if ($story->type === 'ps/doc') {
                $this->docService->remove($story->id);
            } else {
                $story->delete();
            }
        });
        $user->delete();
    }
}
