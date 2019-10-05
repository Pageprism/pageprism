<?php

namespace App\Http\Controllers;

use App\Contracts\RestfulResourceNotifs;
use App\PSPublisher;
use App\ResourceNotifs\InviteNotifs;
use App\User;
use App\Invite;
use Illuminate\Http\Request;
use Validator;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use App\Contracts\NotifManager;
use App\Services\AwrCTRHelper;
use App\Services\CanUser;


class InviteController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    /**
     * @var CanUser
     */
    protected $canUser;

    /**
     * PSPublisherController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param CanUser $canUser
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper,
                                CanUser $canUser)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->canUser = $canUser;

    }

    public function getNotifs(): RestfulResourceNotifs
    {
        return new InviteNotifs($this->notifManager);
    }


    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }

    public function getModel()
    {
        return Invite::class;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'email' => 'required',
            'name' => 'required'
        ]);
    }


    public function additionalCreateCheck(Request $request)
    {
        $user = $request->user();
        $data = $request->all();
        $email = $data['email'];
        $foundInvites = Invite::where('email', $email)
            ->where('inviter_id', $user->id)->get()->count();
        return $this->isEmailAvailable($request) && $foundInvites < 1;
    }


    public function onCreateError(Request $request, $err)
    {
        if (!$this->additionalCreateCheck($request)) {
            $err['message'] = 'The invitee email should not belong to a registered user.';
            if ($this->isEmailAvailable($request)) {
                $err['message'] = 'The inviter can only create max 1 invite per unregistered email.';
            }
        }
        return $err;
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        $user = $request->user();
        $item = Invite::find($id);
        return empty($item) || $item->inviter_id === $user->id;
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        if (!$this->additionalRemoveCheck($request, $id)) {
            $err['message'] = 'Only the original invite creator is allowed to remove item.';
        }
        return $err;
    }


    public function listAll(Request $request, $key = null, $value = null)
    {
        $user = $request->user();
        /*limit user's own organizations only if specified in the params*/
        return parent::listAll($request, ['inviter_id' => $user->id, 'status'], $value);
    }

    public function onResult($res)
    {
        $res->inviter;
        $res->invitee;

        if (!empty($res->inviter)) {
            unset($res->inviter->email);
            unset($res->inviter->phone);
        }
        if (!empty($res->invitee)) {
            unset($res->invitee->email);
            unset($res->invitee->phone);
        }
    }

    public function createOne(Request $request)
    {
        $user = $request->user();
        $item = new Invite();
        $item->fill($request->all());
        $item->inviter_id = $user['id'];
        $item->status = 'pending';
        $item->role_name = 'default';
        $item->save();
        return $item;
    }

    private function isEmailAvailable(Request $request)
    {
        $data = $request->all();
        $email = $data['email'];
        $foundUsers = User::where('email', $email)->get()->count();
        return $foundUsers < 1;
    }

}
