<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Track;
use App\ApiToken;
use App\Traits\CTRUtils;
use Laravel\Passport\TokenRepository;
use Carbon\Carbon;
use App\Contracts\AwrRestfulController;
use App\Contracts\RestfulResourceNotifs;
use App\Services\AwrCTRHelper;
use App\Contracts\NotifManager;


class UserSessionController extends AwrAPICTR implements AwrRestfulController
{

    use CTRUtils;

    /**
     * The token repository implementation.
     *
     * @var \Laravel\Passport\TokenRepository
     */
    protected $tokenRepository;


    /**
     * UserSessionController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param TokenRepository $tokenRepository
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper, TokenRepository $tokenRepository)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->tokenRepository = $tokenRepository;
    }

    public function getModel()
    {
        return Track::class;
    }

    public function onResult($res)
    {

        $hide = ['token_id', 'min', 'max', 'count', 'target_id',
            'target_type', 'server_session_id',
            'device_session_id', 'session_id', 'content',
            'duration', 'from_link', 'to_link', 'token'];
        $res->user;
        $res->token;
        $res->alive = !$res->token->revoked;
        $res->first_activity = new Carbon($res->created_at);
        $res->last_activity = new Carbon($res->updated_at);
        unset($res->user->email);
        unset($res->user->phone);
        foreach ($hide as $h) {
            unset($res[$h]);
        }

    }

    public function listAll(Request $request, $key = null, $value = null)
    {
//        return parent::listAll($request, [], null);
        $user = $request->user();
        $all = Track::where('user_id', $user->id)->where('name', 'activity@token')->get();
        foreach ($all as $s) {
            $s->is_current = $s->token_id === $request['current_token_id'];
        }
        return $all;

    }


    /**
     * Revoke ApiToken associated with the UserSession instance
     * (specified by the its $id)
     *
     * @param  int $id
     * @param  Request $request
     * @return \Illuminate\Http\Response | array
     */
    public function destroy(Request $request, $id)
    {
        $track = Track::find($id);
        if (empty($track)) {
            $err = ['message' => 'not found'];
            $err = $this->onRemoveError($request, $err, $id);
            return response()->json($err, 404);
        }
        $track->token;
        if (!empty($track->token) && !$track->token->revoked) {
            $track->token->revoked = true;
            $track->token->save();
            $res = ['message' => 'session revoked'];
            $this->notifs->notifyRemove($request, $track);
        } else {
            $res = ['message' => 'session already revoked'];
        }
        return response()->json($res, 202);

    }

}
