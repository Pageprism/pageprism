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

class SkillNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
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

        $this->notifManager->broadcastInApp('new-skill', 'skills', $resource->id, 'users', $resource->user_id);
    }

    public function notifyRemove(Request $request, $resource)
    {
        $this->notifManager->broadcastInApp('remove-skill', 'skills', $resource->id, 'users', $resource->user_id);
    }

}