<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Laravel\Passport\Client;
use App\Session;

class RecognizeOwnClients extends VerifyCsrfToken
{
    static $validCsrfKeys = [];

    /**
     * Add a client_id and client_secret (only if missing!) into requests made by trusted clients.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        //WI8xh33oQ2gfr6IpH0L8ClS5cJ2yEA3iUK1vO2o7
        $data = $request->all();
        $envName = env('APP_ENV');
        $devCSRF = env('DEV_CLIENT_CSRF');
        $csrfToken = $request->header('X-CSRF-TOKEN');
        /*
         * The goal of this one is to allow our own clients to
         * not use client_id and secret with their calls instead their CSRF could be enough.
         * We don't use laravel's own csrf methods because it requires using
         * web middleware which is something we don't want to do with our API calls.
         */
        //$csrfToken = $this->getTokenFromRequest($request);
        //$this->tokensMatch($request);
        $ownClient = $this->isCSRFValid($csrfToken) && empty($data['client_id']);
        $devClient = !(is_null($envName) || is_null($devCSRF)) && $envName !== 'production' && $devCSRF === $csrfToken;
        $request->merge([
            "array" => static::$validCsrfKeys
        ]);
        if ($ownClient || $devClient) {
            /*@note: the awr_ux_client should be created as a password_client!*/
            $uxApp = Client::where('name', 'awr_ux_client')->where('password_client', 1)->first();
            /*the secret property is hidden by default */
            $uxApp->makeVisible('secret');
            $request->merge([
                "client_id" => $uxApp->id,
                "client_secret" => $uxApp->secret
            ]);
        }
        return $next($request);
    }

    private function isCSRFValid($csrf)
    {
        if (in_array($csrf, static::$validCsrfKeys)) {
            return true;
        }
        $sessions = Session::all()->map(function ($s) use ($csrf) {
            $payload = unserialize(base64_decode($s->payload));
            return $payload['_token'];
        });
        static::$validCsrfKeys = $sessions
            ->sortByDesc('last_activity')->take(100)->toArray();
        return $sessions->contains($csrf);
    }
}
