<?php


namespace App\Services;

use Log;
use Redis;
use App\Story;
use App\User;
use App\ApiToken;
use App\Notification;
use App\Contracts\NotificationService;
use App\Contracts\InAppNotifier;


class InAppNotifManager extends GenericNotifService implements NotificationService, InAppNotifier
{
    /**
     * @var \App\Services\SocketClientResolver
     */
    protected $socketClientResolver;

    /**
     * @var NotifBodyDecorator
     */
    protected $notifBodyDecorator;

    /**
     * InAppNotifManager constructor.
     * @param SocketClientResolver $socketClientResolver
     * @param NotifBodyDecorator $notifBodyDecorator
     */
    function __construct(SocketClientResolver $socketClientResolver, NotifBodyDecorator $notifBodyDecorator)
    {
        $this->socketClientResolver = $socketClientResolver;
        $this->notifBodyDecorator = $notifBodyDecorator;


    }

    public function notifyStoryAuthorAboutComment($storyId, $commentId)
    {
        $story = Story::find($storyId);
        $this->notifyUserAboutStoryComment($story->user, $storyId, $commentId);
    }

    public function notifyStoryAudienceAboutComment($storyId, $commentId)
    {
        $story = Story::find($storyId);

        foreach ($story->comments as $cmt) {
            $this->notifyUserAboutStoryComment($cmt->user, $storyId, $commentId);
        }

        foreach ($story->reactions as $r) {
            $this->notifyUserAboutStoryComment($r->user, $storyId, $commentId);
        }
    }

    public function notifyStoryAuthorAboutLike($storyId, $reactionId)
    {
        $story = Story::find($storyId);
        $this->notifyUserAboutStoryLike($story->user, $storyId, $reactionId);
    }

    public function notifyStoryAudienceAboutLike($storyId, $reactionId)
    {
        $story = Story::find($storyId);

        foreach ($story->comments as $cmt) {
            $this->notifyUserAboutStoryLike($cmt->user, $storyId, $reactionId);
        }

        foreach ($story->reactions as $r) {
            $this->notifyUserAboutStoryLike($r->user, $storyId, $reactionId);
        }
    }

    public function notifyUserAboutStoryComment($user, $storyId, $commentId)
    {
        $this->notifyInApp($user->id, 'new-comment', 'comments', $commentId, 'stories', $storyId);
    }

    public function notifyUserAboutStoryLike($user, $storyId, $reactionId)
    {
        $this->notifyInApp($user->id, 'new-like', 'reactions', $reactionId, 'stories', $storyId);
    }

    public function notifyFollowersAboutNewStory($story)
    {
        $author = $story->user;
        foreach ($author->followers as $f) {
            $this->notifyInApp($f->id, 'new-story', null, null, 'stories', $story->id);
        }
    }

    public function broadcastInApp($name, $actionType = null, $actionId = null, $targetType, $targetId)
    {
        ApiToken::where('revoked', false)
            ->get()
            ->unique('user_id')
            ->flatten()
            ->each(function ($nxt) use ($name, $actionType, $actionId, $targetType, $targetId) {
                $query = [
                    'user_id' => $nxt->user_id,
                    'name' => $name,
                    'target_type' => $targetType,
                    'target_id' => $targetId,
                ];
                if (!empty($actionType)) {
                    $query['action_type'] = $actionType;
                }
                if (!empty($actionId)) {
                    $query['action_id'] = $actionId;
                }
                if (!($this->isNotifiedInApp($query))) {
                    /*Note: make doesn't save the model!*/
                    $ntf = $this->makeInAppNotifEntry($query);
                    $this->notifBodyDecorator->decorate($ntf);
                    $clients = $this->socketClientResolver->findForUser($nxt->user_id);
                    $this->publish('broadcast@notification', $ntf, $clients);
                }
            });

    }

    public function notifyInApp($userId, $name, $actionType = null, $actionId = null, $targetType, $targetId)
    {
        $query = [
            'user_id' => $userId,
            'name' => $name,
            'target_type' => $targetType,
            'target_id' => $targetId,
        ];
        if (!empty($actionType)) {
            $query['action_type'] = $actionType;
        }
        if (!empty($actionId)) {
            $query['action_id'] = $actionId;
        }
        if (!($this->isNotifiedInApp($query))) {
            $ntf = $this->createInAppNotifEntry($query);
            $this->notifBodyDecorator->decorate($ntf);
            //TODO: at this point publish on Redis
            $clients = $this->socketClientResolver->findForUser($userId);
            $this->publish('notification', $ntf, $clients);

        }
    }


    public function hintInApp($userId, $name, $hindData)
    {
        if (empty($userId) || empty($name)) {
            return;
        }
        $clients = $this->socketClientResolver->findForUser($userId);
        if (count($clients) > 0) {
            Redis::publish('hint@notification', json_encode(['clients' => $clients, 'body' => ['name' => $name, 'hintData' => $hindData]]));
        }
    }


    public function isNotifiedInApp($query = [])
    {
        if (empty($query) || empty($query['user_id'])) {
            return false;
        }
        $notifs = Notification::where('user_id', $query['user_id']);
        foreach ($query as $key => $value) {
            if (in_array($key, ['name', 'target_type', 'target_id', 'action_type', 'action_id', 'seen'])) {
                $notifs = $notifs->where($key, $value);
            }
        }
        return $notifs->count() > 0;
    }


    public function createInAppNotifEntry($query)
    {
        $ntf = new Notification();
        $ntf->fill($query);
        $ntf->save();
        return $ntf;
    }

    /**
     * not saved ones
     * @param $query
     * @return Notification
     */
    private function makeInAppNotifEntry($query)
    {
        $ntf = new Notification();
        $ntf->fill($query);
        return $ntf;
    }

    private function publish($channel, $ntf, $clients)
    {

        $this->notifBodyDecorator->decorate($ntf);
        //TODO: at this point publish on Redis
        if (count($clients) > 0) {
            Redis::publish($channel, json_encode(['clients' => $clients, 'body' => $ntf]));
        }

    }


}