<?php

namespace App\Http\Controllers;

use App\Services\AwrAppManager;
use Illuminate\Http\Request;
use App\Traits\CTRUtils;
use App\Contracts\NotifManager;
use phpDocumentor\Reflection\Types\Context;


class WebController extends Controller
{
    use CTRUtils;

    /**
     * @var AwrAppManager
     */
    protected $appManager;
    /**
     * @var \App\Contracts\NotifManager
     */
    protected $notifManager;


    /**
     * WebController constructor.
     * @param AwrAppManager $appManager
     * @param NotifManager $notifManager
     */
    public function __construct(AwrAppManager $appManager, NotifManager $notifManager)
    {
        $this->appManager = $appManager;
        $this->notifManager = $notifManager;
    }

    public function home(Request $request)
    {
        $app = $this->appManager->makeApp('home');
        return view($app->type, $app->config);
    }


    public function insider(Request $request)
    {
        $app = $this->appManager->makeApp('insider');
        return view($app->type, $app->config);
    }

    public function read(Request $request)
    {

        return redirect('/errors/404');
    }

    public function profile(Request $request)
    {
        return redirect('/errors/404');
    }

    public function unauthorized(Request $request){
        $context = $this->appManager->makeApp('home');
        return view('unauthorized', $context->config);
    }

}
