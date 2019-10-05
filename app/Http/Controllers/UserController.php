<?php

namespace App\Http\Controllers;

use App\Contracts\NotifManager;
use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\UserNotifs;

use App\Services\AwrCTRHelper;
use App\Services\PSDocService;
use Illuminate\Http\Request;
use App\User;
use App\Exchange;
use App\Jobs\ConfirmEmail;
use App\Traits\CTRUtils;
use App\Traits\UserCredentialExchange;
use App\Contracts\AwrRestfulController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


class UserController extends AwrAPICTR implements AwrRestfulController
{

    use CTRUtils, UserCredentialExchange;

    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper)
    {
        parent::__construct($notifManager, $awrCTRHelper);

    }

    public function isModelRelatedToAuthenticatedUser()
    {
        return false;
    }

    public function getNotifs(): RestfulResourceNotifs
    {
        return new UserNotifs($this->notifManager);
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

    public function newEmailConfirmLink(Request $request)
    {
        $user = $request->user();
        if (empty($user)) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $emailManager = $this->notifManager->getEmailNotifManager();
        $emailManager->sendEmailConfirm($user, false);
        return response()->json(['message' => 'Email confirmation link sent'], 201);
    }


}
