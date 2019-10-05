<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/21/18
 * Time: 6:58 PM
 */

namespace App\ResourceNotifs;

use App\BusyStory;
use Log;
use App\Adapters\RestfulNotifsAdapter;
use App\Contracts\RestfulResourceNotifs;
use Illuminate\Http\Request;
use App\Contracts\NotifManager;
use App\OncePublishedStory;


class PSDocNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
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
        $this->notifManager->broadcastInApp('ps-doc:new', null, null,
            'stories', $resource->id);
    }


    public function notifyBeforeUpdate(Request $request, $resource)
    {
        $busyCount = BusyStory::where('story_id', $resource->id)->get()->count();
        if ($busyCount > 0) {
            return;
        }
        $isPublishRequest = $resource->status == 'draft' && $request->all()['status'] === 'published';
        $isUnpublishRequest = $resource->status == 'published' && $request->all()['status'] === 'draft';
        $oncePublished = OncePublishedStory::where('story_id', $resource->id)->count() > 0;
        $psEmailManager = $this->notifManager->getPSEmailManager();
        if ($isPublishRequest && !$oncePublished) {
            $psEmailManager->notifySubscriberAboutNewDoc($resource);
            $oncePublished = new OncePublishedStory();
            $oncePublished->story_id = $resource->id;
            $oncePublished->save();
        }
        if ($isUnpublishRequest) {
            $this->notifManager->broadcastInApp('ps-doc:unpublish', null, null, 'stories', $resource->id);
        } else if ($isPublishRequest) {
            $this->notifManager->broadcastInApp('ps-doc:publish', null, null, 'stories', $resource->id);
        } else {
            $this->notifManager->broadcastInApp('ps-doc:update', null, null, 'stories', $resource->id);
        }
    }

    public function notifyBeforeRemove(Request $request, $resource)
    {
        $this->notifManager->broadcastInApp('ps-doc:remove', null, null, 'stories', $resource->id);
    }


}