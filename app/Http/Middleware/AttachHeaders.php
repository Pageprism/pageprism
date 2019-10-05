<?php

namespace App\Http\Middleware;

use Closure;
use Laravel\Passport\Client;
use Illuminate\Http\Response;

class AttachHeaders
{
    /**
     * Handle an incoming request. Make sure that
     * tokens are coming from right clients.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        $response->header('Access-Control-Allow-Headers','X-CSRF-Token');
        return $response;

//        Access-Control-Allow-Headers: X-CSRF-Token
//        response()->withHeaders(['Access-Control-Allow-Headers' => 'X-CSRF-Token']);
        /*Allow all clients in dev env to pass*/

    }

}
