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
use App\OncePublishedStory;
use App\Comment;


class MyBlogNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
{
    /**
     *  constructor.
     * @param NotifManager $notifManager
     */
    public function __construct(NotifManager $notifManager)
    {
        parent::__construct($notifManager);
    }

    public function notifyBeforeUpdate(Request $request, $resource)
    {
        $isPublishRequest = $resource->status == 'draft' && $request->all()['status'] === 'published';
        $isUnpublishRequest = $resource->status == 'published' && $request->all()['status'] === 'draft';
        $oncePublished = OncePublishedStory::where('story_id', $resource->id)->count() > 0;
        if ($isPublishRequest && !$oncePublished) {
            $this->notifManager->notifyFollowersAboutNewStory($resource);
            $oncePublished = new OncePublishedStory();
            $oncePublished->story_id = $resource->id;
            $oncePublished->save();
        }
        if ($isUnpublishRequest) {
            $this->notifManager->broadcastInApp('unpublish', null, null, 'stories', $resource->id);
        }else if($isPublishRequest){
            $this->notifManager->broadcastInApp('publish', null, null, 'stories', $resource->id);
        }else{
            $this->notifManager->broadcastInApp('update-story', null, null, 'stories', $resource->id);
        }
    }

    public function notifyRemove(Request $request, $resource)
    {
        $this->notifManager->broadcastInApp('remove-story', null, null, 'stories', $resource->id);
    }


}