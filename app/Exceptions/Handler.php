<?php

namespace App\Exceptions;

use App\Listeners\LoggingListener;
use App\Services\AwrAppManager;
use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Log\Events\MessageLogged;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\UnauthorizedException;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymResponse;
class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    protected $appManager;
//
//    /**
//     * The unique incident ID code
//     *
//     * @var string|bool
//     */
//    protected $incidentCode = false;

    public function __construct(Container $container, AwrAppManager $appManager)
    {
        parent::__construct($container);
        $this->appManager = $appManager;
    }

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param Exception $exception
     * @return mixed|void
     * @throws Exception
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }


    /**
     * Render an exception into an HTTP response.
     *
     * @param  Request $request
     * @param  \Exception $exception
     * @return Response
     */
    public function render($request, Exception $exception)
    {

        // 404 page when a model is not found
        if ($exception instanceof ModelNotFoundException) {
            return response()->view('errors.404', [], 404);
        }

        if ($this->isHttpException($exception)) {
            return $this->renderHttpException($exception);
        } else {
            // Custom error 401 and 500 view for production
            if (app()->environment() == 'production') {
                return $exception->getMessage() == "Unauthenticated." ?
                    response()->view('errors.401', [], 401) :
                    response()->view('errors.500', [], 500);
            }
            return parent::render($request, $exception);
        }
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'Unauthenticated.',
                'message' => 'No sufficient access rights detected for accessing this resource.',
                'is_auth_exception_handler' => true
            ], 401);
        }
        return redirect()->route('unauthorized');
    }

    /**
     * This override enables the error layouts to be dynamically chosen based
     * on the app layout_group. With this setup the home app ,(note the appCode == 'home'),
     * of a group will be taken as the style frame for all errors and server rendered views.
     *
     * @param HttpExceptionInterface $e
     * @return Response| SymResponse
     */
    protected function renderHttpException(HttpExceptionInterface $e)
    {
        $status = $e->getStatusCode();

        $paths = collect(config('view.paths'));

        view()->replaceNamespace('errors', $paths->map(function ($path) {
            return "{$path}/errors";
        })->push(__DIR__ . '/views')->all());

        if (view()->exists($view = "errors::{$status}")) {
            $context = $this->appManager->makeApp('home');
            $context->config['exception'] = $e;
            return response()->view($view, $context->config, $status, $e->getHeaders());
        }

        return parent::renderHttpException($e);
    }
}
