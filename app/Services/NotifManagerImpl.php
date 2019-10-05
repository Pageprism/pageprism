<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use App\Contracts\NotifManager;

class NotifManagerImpl extends GenericNotifService implements NotifManager
{

    /**
     * @var EmailNotifManager
     */
    protected $emailNotifManager;

    /**
     * @var InAppNotifManager
     */
    protected $inAppNotifManager;

    /**
     * @var PSEmailManager
     */
    public $psEmailManager;

    /**
     * NotifManagerImpl constructor.
     * @param EmailNotifManager $emailNotifManager
     * @param InAppNotifManager $inAppNotifManager
     * @param PSEmailManager $psEmailManager
     */
    function __construct(EmailNotifManager $emailNotifManager, InAppNotifManager $inAppNotifManager, PSEmailManager $psEmailManager)
    {
        $this->emailNotifManager = $emailNotifManager;
        $this->inAppNotifManager = $inAppNotifManager;
        $this->psEmailManager = $psEmailManager;
    }

    public function getEmailNotifManager(): EmailNotifManager
    {
        return $this->emailNotifManager;
    }

    public function getPSEmailManager(): PSEmailManager
    {
        return $this->psEmailManager;
    }

    public function getInAppNotifManager(): InAppNotifManager
    {
        return $this->inAppNotifManager;
    }


    public function notifyStoryAuthorAboutComment($storyId, $commentId)
    {
        $this->emailNotifManager->setServerRoot($this->server_root);
        $this->emailNotifManager->notifyStoryAuthorAboutComment($storyId, $commentId);
        $this->inAppNotifManager->notifyStoryAuthorAboutComment($storyId, $commentId);

    }

    public function notifyStoryAudienceAboutComment($storyId, $commentId)
    {
        $this->emailNotifManager->setServerRoot($this->server_root);
        $this->emailNotifManager->notifyStoryAudienceAboutComment($storyId, $commentId);
        $this->inAppNotifManager->notifyStoryAudienceAboutComment($storyId, $commentId);
    }

    public function notifyUserAboutStoryComment($user, $storyId, $commentId)
    {
        $this->emailNotifManager->setServerRoot($this->server_root);
        $this->emailNotifManager->notifyUserAboutStoryComment($user, $storyId, $commentId);
        $this->inAppNotifManager->notifyUserAboutStoryComment($user, $storyId, $commentId);
    }

    public function notifyUserAboutStoryLike($user, $storyId, $reactionId)
    {
        /*Note for now the emailManager will skip sending emails for this type of notifs*/
        $this->emailNotifManager->setServerRoot($this->server_root);
        $this->emailNotifManager->notifyUserAboutStoryLike($user, $storyId, $reactionId);
        $this->inAppNotifManager->notifyUserAboutStoryLike($user, $storyId, $reactionId);
    }

    public function notifyStoryAuthorAboutLike($storyId, $commentId)
    {
        /*Note for now the emailManager will skip sending emails for this type of notifs*/
        $this->emailNotifManager->setServerRoot($this->server_root);
        $this->emailNotifManager->notifyStoryAuthorAboutLike($storyId, $commentId);
        $this->inAppNotifManager->notifyStoryAuthorAboutLike($storyId, $commentId);

    }

    public function notifyStoryAudienceAboutLike($storyId, $reactionId)
    {
        /*Note for now the emailManager will skip sending emails for this type of notifs*/
        $this->emailNotifManager->setServerRoot($this->server_root);
        $this->emailNotifManager->notifyStoryAudienceAboutLike($storyId, $reactionId);
        $this->inAppNotifManager->notifyStoryAudienceAboutLike($storyId, $reactionId);

    }

    public function notifyFollowersAboutNewStory($story)
    {
        $this->emailNotifManager->setServerRoot($this->server_root);
        $this->emailNotifManager->notifyFollowersAboutNewStory($story);
        $this->inAppNotifManager->notifyFollowersAboutNewStory($story);
    }

    public function createEmailNotifEntry($query)
    {
        $this->emailNotifManager->createEmailNotifEntry($query);
    }


    public function isNotifiedByEmail($query = [])
    {
        return $this->emailNotifManager->isNotifiedByEmail($query);
    }

    public function createInAppNotifEntry($query)
    {
        $this->inAppNotifManager->createInAppNotifEntry($query);
    }

    public function isNotifiedInApp($query = [])
    {
        return $this->inAppNotifManager->isNotifiedInApp($query);
    }

    public function broadcastInApp($name, $actionType = null, $actionId = null, $targetType, $targetId)
    {
        $this->inAppNotifManager->broadcastInApp($name, $actionType, $actionId, $targetType, $targetId);
    }


    public function notifyInApp($userId, $name, $actionType = null, $actionId = null, $targetType, $targetId)
    {
        $this->inAppNotifManager->notifyInApp($userId, $name, $actionType, $actionId, $targetType, $targetId);
    }

    public function hintInApp($userId, $name, $hindData)
    {
        $this->inAppNotifManager->hintInApp($userId, $name, $hindData);
    }


}