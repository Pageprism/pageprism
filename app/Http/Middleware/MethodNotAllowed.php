<?php

namespace App\Http\Middleware;

use Closure;
use Laravel\Passport\Client;

class MethodNotAllowed
{
    /**
     * This one is used for enabling AwrAPI json file to drop support for
     * specific API methods without having to add a controller logic for this.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        return response()->json([
            'error' => 'Method Not Allowed',
            'message' => 'The HTTP method is not allowed to be used against this resource.'
        ], 405);
    }

}
