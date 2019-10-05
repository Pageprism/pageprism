<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    protected $middleware = [
        \Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \App\Http\Middleware\TrustProxies::class,
        \App\Http\Middleware\AttachHeaders::class
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            // \Illuminate\Session\Middleware\AuthenticateSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class
        ],
        /*
         * Allowing 5000 requests per minute we can change this number if it's too large**/
        'api' => [
            'throttle:5000,1',
            'bindings',
        ],
        'secure:client' => [
            'recognize_own_clients',
            'verify_client'
        ],
        'secure:api' => [
            'secure:client',
            'auth:api',
            'verify_token_client',
            'watch_token_activity'
        ],
        'admins' => [
            'secure:api',
            'role:moderator'
        ],
        'ps_admins' => [
            'secure:api',
            'role:admin@pageshare'
        ]
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'role' => \App\Http\Middleware\CheckRole::class,
        'recognize_own_clients' => \App\Http\Middleware\RecognizeOwnClients::class,
        'verify_client' => \App\Http\Middleware\VerifyClient::class,
        'verify_token_client' => \App\Http\Middleware\VerifyTokenClient::class,
        'add_token_exchange_key' => \App\Http\Middleware\AddTokenExchangeKey::class,
        'method_not_allowed' => \App\Http\Middleware\MethodNotAllowed::class,
        'watch_token_activity' => \App\Http\Middleware\WatchTokenActivity::class,
        'include_socket_token' => \App\Http\Middleware\IncludeSocketToken::class,
    ];
}
