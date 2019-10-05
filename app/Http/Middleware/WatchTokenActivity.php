<?php

namespace App\Http\Middleware;

use Closure;
use App\Services\AccessTokenIdResolver;
use Illuminate\Http\Request;
use App\Track;
use Carbon\Carbon;

/**
 * Tracking token activity and providing support
 * for features like privacy and security where user
 * can be serviced with list of its recent activity
 * and sessions. Without this the UX apps stateless
 * architecture will not be able to keep & track user sessions.
 * Class WatchTokenActivity
 * @package App\Http\Middleware
 */
class WatchTokenActivity
{

    /**
     * The resource server instance.
     *
     * @var \App\AccessTokenIdResolver
     */
    protected $accessTokenIdResolver;


    /**
     * Create a new controller instance.
     *
     * @param  \App\Services\AccessTokenIdResolver $accessTokenIdResolver
     */
    public function __construct(AccessTokenIdResolver $accessTokenIdResolver)
    {
        $this->accessTokenIdResolver = $accessTokenIdResolver;

    }

    public function handle($request, Closure $next)
    {

        /* For debugging uses **/
        // $response = $next($request);
        // $c = json_decode($response->content());
        // $c->track = $this->track($request);
        // $response->setContent(json_encode($c));
        $this->track($request);
        return $next($request);
    }

    private function track(Request $request)
    {
        $user = $request->user();
        $accessTokenId = $this->accessTokenIdResolver->getAccessTokenId($request);

        if (empty($user)) {
            return null;
        }
        $tx = [
            'name' => 'activity@token',
            'user_id' => $user->id,
            'token_id' => $accessTokenId,
            'agent' => $request->server('HTTP_USER_AGENT'),
            'link' => $request->server('REQUEST_URI'),
            'ip' => $request->ip(),
            'updated_at' => Carbon::now()
        ];

        $request->merge([
            'current_token_id' => $tx['token_id']
        ]);

        //updated_at requires carbon dates instead of date('Y-m-d H:i')

        /*
         * Each track item here should be kept unique
         * based on following data items
         **/
        $track = Track::where('name', 'activity@token')
            ->where('token_id', $tx['token_id'])
            ->where('agent', $tx['agent'])
            ->where('user_id', $tx['user_id'])
            ->where('ip', $tx['ip'])
            ->first();
        if (empty($track)) {
            /*
             * In cases where the combination above is
             * not unique we will create new track item*/
            $track = new Track();
        }
        $track->fill($tx);
        $track->save();
        /*Updating also user last_online, (now that we can)**/
        $user->last_online = $tx['updated_at'];
        $user->save();
        return $track;
    }

}
