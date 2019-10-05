<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Exchange;


class AddTokenExchangeKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @param  string|null $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $response = $next($request);
        $groupKey = $request['app_group'];
        $isAdminApp = Hash::check(env('AWR_ADMIN_APP_GROUP', 'default'), $groupKey);
        if ($isAdminApp && $this->_string_starts_with($response->headers->get('content-type'), 'application/json')) {
            $c = json_decode($response->content());
            if(!empty($c->access_token)){
                $exchange = factory(Exchange::class,1)->create([
                    'type' => 'access_token',
                    'value' => $c->access_token
                ])->first();
                $c->exchange = $exchange->key;
                $response->setContent(json_encode($c));
            }
        }
        return $response;
    }

    private function _string_starts_with($haystack, $needle)
    {
        // Recommended version, using strpos
        return strpos($haystack, $needle) === 0;
    }

    private function _get_expires()
    {
        $date = date('Y-m-d H:i:s');
        $currentDate = strtotime($date);
        $futureDate = $currentDate + (60 * 5);
        return date("Y-m-d H:i:s", $futureDate);
    }

}


