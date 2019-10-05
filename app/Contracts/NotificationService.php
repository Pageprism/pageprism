<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/14/18
 * Time: 6:25 PM
 */

namespace App\Contracts;


interface NotificationService
{

    public function setServerRoot($server_root);

    public function notifyStoryAuthorAboutComment($storyId, $commentId);

    public function notifyStoryAudienceAboutComment($storyId, $commentId);

    public function notifyUserAboutStoryComment($user, $storyId, $commentId);

    public function notifyUserAboutStoryLike($user, $storyId, $reactionId);

    public function notifyStoryAuthorAboutLike($storyId, $reactionId);

    public function notifyStoryAudienceAboutLike($storyId, $reactionId);

    public function notifyFollowersAboutNewStory($story);

    public function createUnsubscribeEntry($query);

    public function isUnsubscribedFromNotifs($query = []);

}