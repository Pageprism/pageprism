<?php

namespace App\Http\Middleware;

use Closure;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  $role
     * @return mixed
     */
    public function handle($request, Closure $next, $role)
    {
        $user = $request->user();
        if($user && ($user->hasRole($role) || $user->hasRole('super'))){
            return $next($request);
        }


        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'Forbidden.',
                'message' => 'No sufficient access rights detected for accessing this resource.'
            ], 403);
        }
        return redirect()->route('unauthorized');
    }
}
