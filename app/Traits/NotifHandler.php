<?php

namespace App\Traits;

use Log;
use App\Story;
use App\Comment;
use App\EmailNotification;
use App\NotifChainExclusion;
use App\StoryCmtEmailNotifData;
use App\StoryEmailNotifData;
use App\Jobs\StoryCommentNtfEmail;
use App\Jobs\NewStoryPublishedEmail;

trait NotifHandler
{
    public function notifyStoryAuthorAboutComment($storyId, $commentId, $server_root)
    {
        $story = Story::find($storyId);
        $this->notifyUserAboutStoryComment($story->user, $storyId, $commentId, $server_root);
    }

    public function notifyStoryAudienceAboutComment($storyId, $commentId, $server_root)
    {
        $story = Story::find($storyId);
        foreach ($story->comments as $cmt) {//            if ($story->user->id !== $cmt->user->id) {
            $this->notifyUserAboutStoryComment($cmt->user, $storyId, $commentId, $server_root);
        }
    }

    public function notifyUserAboutStoryComment($user, $storyId, $commentId, $server_root)
    {
        $story = Story::find($storyId);
        $comment = Comment::find($commentId);
        if (empty($story) || empty($comment) || empty($user) || $user->id == $comment->user->id) {
            return;
        }
        if (!($story->type == 'blog' && $story->status == 'published')) {
            return;
        }
        $isForAuthor = $story->user->id == $user->id;
        $noNtfQuery = [
            'user_id' => $user->id,
            'name' => 'story-notifs',
            'target_type' => 'story',
            'target_id' => $storyId
        ];

        $query = [
            'user_id' => $user->id,
            'name' => 'story-cmt-ntf',
            'target_type' => 'comment',
            'target_id' => $commentId
        ];
        if ($this->isNotifiedByEmail($query) || $this->isUnsubscribedFromNotifs($noNtfQuery)) {
            return;
        }
        $this->createEmailNotifEntry($query);
        $emailData = new StoryCmtEmailNotifData($user, $storyId, $commentId, $isForAuthor, $server_root);
        if ($isForAuthor) {
            $subject = 'New comment in your article';
        } else {
            $subject = 'New comment in conversation you follow';
        }
        $this->dispatch(new StoryCommentNtfEmail($user, $emailData, $subject));
    }

    public function notifyFollowersAboutNewStory($story, $server_root)
    {
        $author = $story->user;

        foreach ($author->followers as $f) {
            $query = [
                'user_id' => $f->id,
                'name' => 'new-story-ntf',
                'target_type' => 'story',
                'target_id' => $story->id
            ];
            if (!$this->isNotifiedByEmail($query)) {
                $this->createEmailNotifEntry($query);
                $emailData = new StoryEmailNotifData($story->id, $server_root);
                $this->dispatch(new NewStoryPublishedEmail($f, $emailData));
            }
        }
    }

    public function createEmailNotifEntry($query)
    {
        $emailNtf = new EmailNotification();
        $emailNtf->fill($query);
        $emailNtf->save();
    }

    public function createUnsubscribeEntry($query)
    {
        $unsubscribe = new NotifChainExclusion();
        $unsubscribe->fill($query);
        $unsubscribe->save();
    }

    public function isUnsubscribedFromNotifs($query = [])
    {
        if (empty($query) || empty($query['user_id'])) {
            return false;
        }
        $notifs = NotifChainExclusion::where('user_id', $query['user_id']);
        foreach ($query as $key => $value) {
            if (in_array($key, ['name', 'target_type', 'target_id'])) {
                $notifs = $notifs->where($key, $value);
            }
        }
        return $notifs->count() > 0;
    }

    public function isNotifiedByEmail($query = [])
    {
        if (empty($query) || empty($query['user_id'])) {
            return false;
        }
        $notifs = EmailNotification::where('user_id', $query['user_id']);
        foreach ($query as $key => $value) {
            if (in_array($key, ['name', 'target_type', 'target_id'])) {
                $notifs = $notifs->where($key, $value);
            }
        }
        return $notifs->count() > 0;
    }
}