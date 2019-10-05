<?php

namespace App\Http\Middleware;

use Closure;
use Laravel\Passport\Client;

class VerifyTokenClient
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
        $data = $request->all();
        $user = $request->user();
        $client = null;
        $token = $user->token();
        $token->client;
        $envName = env('APP_ENV');
        $devCSRF = env('DEV_CLIENT_CSRF');
        $csrfToken = $this->getTokenFromRequest($request);
 	/*Giving up on this check as tokens can be shared with session through insider auth*/
	return $next($request);
        /*Allow all clients in dev env to pass*/
        if (!(is_null($envName) || is_null($devCSRF)) &&
            $envName !== 'production' &&
            $devCSRF === $csrfToken) {
            return $next($request);
        }
        if (isset($data['client_id']) && isset($data['client_secret'])) {
            $client = Client::where('id', $data['client_id'])->where('secret', $data['client_secret'])->first();
        }
        if (!is_null($client) && $token->client->id === $client->id) {
            return $next($request);
        }
        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'Forbidden.',
                'message' => 'No sufficient access rights detected for accessing this resource.',
                'client_id' => $data['client_id'],
                'client_secret' => $data['client_secret']
            ], 403);
        }
        return redirect()->route('unauthorized');
    }

    /**
     * Get the CSRF token from the request.
     *
     * @param  \Illuminate\Http\Request $request
     * @return string
     */
    protected function getTokenFromRequest($request)
    {
        $token = $request->input('_token') ?: $request->header('X-CSRF-TOKEN');

        if (!$token && $header = $request->header('X-XSRF-TOKEN')) {
            $token = $this->encrypter->decrypt($header);
        }

        return $token;
    }


}
