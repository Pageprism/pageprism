<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/21/18
 * Time: 6:58 PM
 */

namespace App\ResourceNotifs;


use App\Adapters\RestfulNotifsAdapter;
use App\Contracts\RestfulResourceNotifs;
use Illuminate\Http\Request;
use App\Contracts\NotifManager;
use App\Comment;

//use Log

class ProfileStoryNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
{
    /**
     *  constructor.
     * @param NotifManager $notifManager
     */
    public function __construct(NotifManager $notifManager)
    {
        parent::__construct($notifManager);
    }

    public function notifyUpdate(Request $request, $resource)
    {
        $this->notifManager->broadcastInApp('update-profile-story', 'stories', $resource->id, 'users', $resource->user_id);
    }
}