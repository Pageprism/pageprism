<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/14/18
 * Time: 5:58 PM
 */

namespace App\Services;

use App\Contracts\EmailNotifier;
use App\invite;
use App\Jobs\PersonJoinedEmail;
use Illuminate\Support\Facades\Log;
use App\User;
use App\Story;
use App\Comment;
use App\EmailNotification;
use App\EmailData\StoryCmtEmailNotifData;
use App\EmailData\StoryEmailNotifData;
use App\Jobs\StoryCommentNtfEmail;
use App\Jobs\NewStoryPublishedEmail;
use App\Contracts\NotificationService;
use Illuminate\Foundation\Bus\DispatchesJobs;
use App\Exchange;
use App\Traits\CTRUtils;
use App\Jobs\ConfirmEmail;

class EmailNotifManager extends GenericNotifService implements NotificationService, EmailNotifier
{

    use DispatchesJobs, CTRUtils;

    /**
     * In disabled mode the db entries will be generated but no actual email will be sent
     * @var bool
     */
    private $disabled;

    function __construct()
    {
//        $this->disabled = env('APP_ENV','local') === 'local' || env('APP_ENV','local') === 'development' ;
        $this->disabled = false;
    }

    /**
     * @param User $user
     * @param $isWelcomeLink
     */
    public function sendEmailConfirm(User $user, $isWelcomeLink)
    {
        $exchange = new Exchange();
        $server_root = static::getServerRoot();

        $exchange->fill([
            'key' => uniqid($user->id . '_'),
            'value' => $user->email,
            'type' => 'confirm_email'
        ]);
        $exchange->save();
        $link = $server_root . '/confirm/email/' . static::encodeItemShareId($exchange->key, $user->id);
        $this->dispatch(new ConfirmEmail($user, [
            'link' => $link,
            'isWelcomeLink' => $isWelcomeLink,
            'server_root' => $server_root
        ]));
    }

    public function notifyAboutNewlyJoinedPerson(User $joined)
    {
        $server_root = static::getServerRoot();
        Invite::where('email', $joined->email)
            ->get()
            ->each(function ($invite) use ($joined, $server_root) {
                $by = $invite->inviter;
                $query = [
                    'user_id' => $by->id,
                    'name' => 'person-joined-notif',
                    'target_type' => 'invites',
                    'target_id' => $invite->id
                ];
                $invite->status = 'accepted';
                $invite->name = $joined->name;
                $invite->save();

                if (!$this->isNotifiedByEmail($query)) {
                    $this->createEmailNotifEntry($query);
                    $this->dispatch(new PersonJoinedEmail($by, [
                        'person' => $joined,
                        'server_root' => $server_root
                    ]));
                }
            });
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

    public function notifyUserAboutStoryComment($user, $storyId, $commentId)
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
            'target_type' => 'stories',
            'target_id' => $storyId
        ];

        $query = [
            'user_id' => $user->id,
            'name' => 'story-cmt-ntf',
            'target_type' => 'comments',
            'target_id' => $commentId
        ];
        if ($this->isNotifiedByEmail($query) || $this->isUnsubscribedFromNotifs($noNtfQuery)) {
            return;
        }
        $this->createEmailNotifEntry($query);
        $emailData = new StoryCmtEmailNotifData($user, $storyId, $commentId, $isForAuthor, $this->server_root);
        if ($isForAuthor) {
            $subject = 'New comment in your article';
        } else {
            $subject = 'New comment in conversation you follow';
        }
        if ($this->disabled) {
            return;
        }
        $this->dispatch(new StoryCommentNtfEmail($user, $emailData, $subject));
    }

    public function notifyFollowersAboutNewStory($story)
    {

        $author = $story->user;

        foreach ($author->followers as $f) {
            $query = [
                'user_id' => $f->id,
                'name' => 'new-story-ntf',
                'target_type' => 'stories',
                'target_id' => $story->id
            ];
            if (!$this->isNotifiedByEmail($query)) {
                $this->createEmailNotifEntry($query);
                $emailData = new StoryEmailNotifData($story->id, $this->server_root);
                if ($this->disabled) {
                    return;
                }
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