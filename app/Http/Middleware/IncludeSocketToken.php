<?php

namespace App\Http\Middleware;

use App\Exchange;
use Closure;
use App\Services\AccessTokenIdResolver;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Traits\CTRUtils;

/**
 * Tracking token activity and providing support
 * for features like privacy and security where user
 * can be serviced with list of its recent activity
 * and sessions. Without this the UX apps stateless
 * architecture will not be able to keep & track user sessions.
 * Class WatchTokenActivity
 * @package App\Http\Middleware
 */
class IncludeSocketToken
{

    use CTRUtils;
    /**
     * The resource server instance.
     *
     * @var \App\Services\AccessTokenIdResolver
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

    public function handle(Request $request, Closure $next)
    {

        $response = $next($request);
        if ($this->_string_starts_with($response->headers->get('content-type'), 'application/json')) {
            $c = json_decode($response->content());

                $accessTokenId = $this->accessTokenIdResolver->getAccessTokenId($request);
                $c->socket_token = $this->createSocketExchange($accessTokenId);
                $response->setContent(json_encode($c));
        }

        return $response;
    }

    private function _string_starts_with($haystack, $needle)
    {
        // Recommended version, using strpos
        return strpos($haystack, $needle) === 0;
    }

    private function createSocketExchange($accessTokenId){

        $exchange = Exchange::where('type','socket_token')->where('value',$accessTokenId)->first();
        if(empty($exchange)){
            $exchange = new Exchange();
            $exchange->fill([
                'key' => uniqid('socket_',true),
                'value' => $accessTokenId,
                'used' => 0,
                'type' => 'socket_token'
            ]);
            $exchange->save();
        }
        return $this->encodeItemShareId($exchange->key,'socket');
    }
}
