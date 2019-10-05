<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/21/18
 * Time: 6:58 PM
 */

namespace App\ResourceNotifs;

use App\User;
use Log;
use App\Adapters\RestfulNotifsAdapter;
use App\Contracts\RestfulResourceNotifs;
use Illuminate\Http\Request;
use App\Contracts\NotifManager;


class UserNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
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
        $user = User::find($resource->id);
        $emailManager = $this->notifManager->getEmailNotifManager();
        $emailManager->sendEmailConfirm($user, true);
        $emailManager->notifyAboutNewlyJoinedPerson($user);
    }

}