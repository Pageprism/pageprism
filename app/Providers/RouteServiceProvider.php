<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
        $this->mapAwrApiRoutes();
        //
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }

    /**
     * AWR APIs are simple fully restful structures. AwrAPICTR should be
     * extended by all AWR API compatible controllers and the routes should
     * be defined in routes/awr_api.json
     */
    protected function mapAwrApiRoutes()
    {

        $path = base_path('routes/awr_api.json');
        $cnf = json_decode(file_get_contents($path), true);
        $middleware = isset($cnf['middleware']) && is_string($cnf['middleware']) &&
        $cnf['middleware'] !== 'none' ? $cnf['middleware'] : null;

        foreach ($cnf['routes'] as $r) {
            $indexMiddleware = $middleware;
            $headMiddleware = $middleware;
            $showMiddleware = $middleware;
            $storeMiddleware = $middleware;
            $updateMiddleware = $middleware;
            $destroyMiddleware = $middleware;
            if (isset($r['middleware'])) {
                if (is_string($r['middleware'])) {
                    $middleware = $r['middleware'] !== 'none' ? $r['middleware'] : null;
                    $indexMiddleware = $middleware;
                    $headMiddleware = $middleware;
                    $showMiddleware = $middleware;
                    $storeMiddleware = $middleware;
                    $updateMiddleware = $middleware;
                    $destroyMiddleware = $middleware;
                } elseif (is_array($r['middleware'])) {
                    $indexMiddleware = isset($r['middleware']['index']) ? $r['middleware']['index'] : $indexMiddleware;
                    $headMiddleware = isset($r['middleware']['head']) ? $r['middleware']['head'] : $headMiddleware;
                    $showMiddleware = isset($r['middleware']['show']) ? $r['middleware']['show'] : $showMiddleware;
                    $storeMiddleware = isset($r['middleware']['store']) ? $r['middleware']['store'] : $storeMiddleware;
                    $updateMiddleware = isset($r['middleware']['update']) ? $r['middleware']['update'] : $updateMiddleware;
                    $destroyMiddleware = isset($r['middleware']['destroy']) ? $r['middleware']['destroy'] : $destroyMiddleware;
                }
            }
            $controller = $cnf['controllers_path'] . '\\' . $r['controller'];
            $this->setRouteConfig($indexMiddleware, $cnf['prefix'], $r['resource'], $controller, 'index');
//            $this->setRouteConfig($headMiddleware, $cnf['prefix'], $r['resource'], $controller, 'size');
            $this->setRouteConfig($storeMiddleware, $cnf['prefix'], $r['resource'], $controller, 'store');
            $this->setRouteConfig($showMiddleware, $cnf['prefix'], $r['resource'] . '/{id}', $controller, 'show');
            $this->setRouteConfig($updateMiddleware, $cnf['prefix'], $r['resource'] . '/{id}', $controller, 'update');
            $this->setRouteConfig($destroyMiddleware, $cnf['prefix'], $r['resource'] . '/{id}', $controller, 'destroy');
        }
    }

    /**
     * Needed for setting up AWR APIs
     * @param $middleware
     * @param $prefix
     * @param $resource
     * @param $controller
     * @param $fnName
     */
    private function setRouteConfig($middleware, $prefix, $resource, $controller, $fnName)
    {
        $controller = str_replace('/', '\\', $controller);
        if ($fnName === 'index' || $fnName === 'show') {
            if (!empty($middleware) && is_string($middleware) && $middleware !== 'none') {
                Route::prefix($prefix)
                    ->middleware($middleware)
                    ->get('/' . $resource, $controller . '@' . $fnName);
            } else {
                Route::prefix($prefix)
                    ->get('/' . $resource, $controller . '@' . $fnName);
            }
        } elseif ($fnName === 'head') {
            if (!empty($middleware) && is_string($middleware) && $middleware !== 'none') {
                Route::prefix($prefix)
                    ->middleware($middleware)
                    ->head('/' . $resource, $controller . '@' . $fnName);
            } else {
                Route::prefix($prefix)
                    ->head('/' . $resource, $controller . '@' . $fnName);
            }
        } elseif ($fnName === 'store') {
            if (!empty($middleware) && is_string($middleware) && $middleware !== 'none') {
                Route::prefix($prefix)
                    ->middleware($middleware)
                    ->post('/' . $resource, $controller . '@' . $fnName);
            } else {
                Route::prefix($prefix)
                    ->post('/' . $resource, $controller . '@' . $fnName);
            }
        } elseif ($fnName === 'update') {
            if (!empty($middleware) && is_string($middleware) && $middleware !== 'none') {
                Route::prefix($prefix)
                    ->middleware($middleware)
                    ->put('/' . $resource, $controller . '@' . $fnName);
            } else {
                Route::prefix($prefix)
                    ->put('/' . $resource, $controller . '@' . $fnName);
            }
        } elseif ($fnName === 'destroy') {
            if (!empty($middleware) && is_string($middleware) && $middleware !== 'none') {
                Route::prefix($prefix)
                    ->middleware($middleware)
                    ->delete('/' . $resource, $controller . '@' . $fnName);
            } else {
                Route::prefix($prefix)
                    ->delete('/' . $resource, $controller . '@' . $fnName);
            }
        }

    }
}
