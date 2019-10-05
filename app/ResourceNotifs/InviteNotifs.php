<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/21/18
 * Time: 6:58 PM
 */

namespace App\ResourceNotifs;

use Log;
use App\Adapters\RestfulNotifsAdapter;
use App\Contracts\RestfulResourceNotifs;
use Illuminate\Http\Request;
use App\Contracts\NotifManager;


class InviteNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
{
    /**
     *  constructor.
     * @param NotifManager $notifManager
     */
    public function __construct(NotifManager $notifManager)
    {
        parent::__construct($notifManager);
    }

    public function notifyCreate(Request $request, $resource)
    {
        $psEmailManager = $this->notifManager->getPSEmailManager();
        $psEmailManager->sendInviteEmail($resource);
    }

}