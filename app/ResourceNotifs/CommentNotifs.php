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


class CommentNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
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
        $this->notifManager->notifyStoryAuthorAboutComment($resource->story_id, $resource->id);
        $this->notifManager->notifyStoryAudienceAboutComment($resource->story_id, $resource->id);
        $this->notifManager->broadcastInApp('new-comment', 'comments', $resource->id,
            'stories', $resource->story_id);
    }

    public function notifyRemove(Request $request, $resource)
    {
        $this->notifManager->broadcastInApp('remove-comment', 'comments', $resource->id,
            'stories', $resource->story_id);
    }

}