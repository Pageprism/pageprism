<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/19/18
 * Time: 11:52 PM
 */

namespace App\Adapters;


use App\Contracts\RestfulResourceNotifs;
use Illuminate\Http\Request;
use App\Contracts\NotifManager;
use App\Services\PSEmailManager;

class RestfulNotifsAdapter implements RestfulResourceNotifs
{
    /**
     * @var \App\Contracts\NotifManager|NotifManager
     */
    protected $notifManager;

    /**
     * @var PSEmailManager
     */
    protected $psEmailManager;

    /**
     * RestfulNotifsAdapter constructor.
     * @param NotifManager $notifManager
     */
    public function __construct(NotifManager $notifManager)
    {
        $this->notifManager = $notifManager;
        $this->psEmailManager = $notifManager->getPSEmailManager();
    }


    public function notifyCreate(Request $request, $resource)
    {
        // This adapter method has no implementation
    }

    public function notifyUpdate(Request $request, $resource)
    {
        // This adapter method has no implementation
    }

    public function notifyRemove(Request $request, $resource)
    {
        // This adapter method has no implementation
    }

    public function notifyList(Request $request, $resource)
    {
        // This adapter method has no implementation
    }

    public function notifyFindOne(Request $request, $resource)
    {
        // This adapter method has no implementation
    }

    //---before notifs

    public function notifyBeforeCreate(Request $request)
    {
        // This adapter method has no implementation
    }

    public function notifyBeforeUpdate(Request $request, $resource)
    {
        // This adapter method has no implementation
    }

    public function notifyBeforeRemove(Request $request, $resource)
    {
        // This adapter method has no implementation
    }

}