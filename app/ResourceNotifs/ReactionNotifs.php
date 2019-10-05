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
use App\ReactionType;
use App\Reaction;



class ReactionNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
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
        $targetType = $this->getReactionTargetType($resource);
        $target = $this->getReactionTarget($resource);
        $rType = $resource->type;
        if ($rType->name === 'like' && !empty($target) && $targetType === 'stories') {
            $this->notifManager->notifyStoryAuthorAboutLike($target->id, $resource->id);
            $this->notifManager->notifyStoryAudienceAboutLike($target->id, $resource->id);
        } else if ($rType->name === 'like' && !empty($target) && $targetType === 'comments') {
            /*when a comment gets liked notifying the commenter only through inApp notifs*/
            $this->notifManager->notifyInApp($target->user->id, 'new-like', 'reactions', $resource->id, 'comments', $target->id);
        }
        $this->notifManager->broadcastInApp('new-' . $rType->name, 'reactions', $resource->id, $targetType, $target->id);
    }

    public function notifyRemove(Request $request, $resource)
    {
        $targetType = $this->getReactionTargetType($resource);
        $target = $this->getReactionTarget($resource);
        $rType = $resource->type;
        if(empty($target)){
            return;
        }
        $this->notifManager->broadcastInApp('remove-' . $rType->name, 'reactions', $resource->id, $targetType, $target->id);
    }


    private function getReactionTargetType($item)
    {
        if (!empty($item->story)) {
            return 'stories';
        } else if (!empty($item->comment)) {
            return 'comments';
        }
        return $item->target_type;
    }

    private function getReactionTarget($item)
    {
        if (!empty($item->story)) {
            return $item->story;
        } else if (!empty($item->comment)) {
            return $item->comment;
        }
        return $item->target();
    }

}