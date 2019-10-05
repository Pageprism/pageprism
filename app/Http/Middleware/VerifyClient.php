<?php

namespace App\Http\Middleware;

use Closure;
use Laravel\Passport\Client;
use Illuminate\Http\Response;

class VerifyClient
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
        $client = null;
        $envName = env('APP_ENV');
        $devCSRF = env('DEV_CLIENT_CSRF');
        $csrfToken = $this->getTokenFromRequest($request);
        if (isset($data['client_id']) && isset($data['client_secret'])) {
            $client = Client::where('id', $data['client_id'])->where('secret', $data['client_secret'])->first();
        }
        // make sure this allowed in some middleware-> Access-Control-Allow-Headers: X-CSRF-Token
        /*Allow all clients in dev env to pass*/
        if (!(is_null($envName) || is_null($devCSRF)) &&
            $envName !== 'production' &&
            $devCSRF === $csrfToken) {
            return $next($request);
        }
        /*In production mode we accept only registered client calls*/
        if (!is_null($client) && $client->revoked === false) {
            return $next($request);
        }
        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'Forbidden.',
                'message' => 'No sufficient access rights detected for accessing this resource.',
                'reason' => 'Failed to verify client'
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
