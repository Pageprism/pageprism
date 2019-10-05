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

class FollowingNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
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
        $this->notifManager->notifyInApp($resource->followed_id, 'new-following',
            'followings', $resource->id, 'users', $resource->followed_id);
        $this->notifManager->broadcastInApp('new-followers-count', null, null,
            'users', $resource->followed_id);
    }

    public function notifyBeforeRemove(Request $request, $resource)
    {
        $this->notifManager->notifyInApp($resource->followed_id, 'remove-following',
            'followings', $resource->id, 'users', $resource->followed_id);

    }

    public function notifyRemove(Request $request, $resource)
    {
        $this->notifManager->broadcastInApp('new-followers-count', null, null,
            'users', $resource->followed_id);
    }


}