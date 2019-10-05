<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/16/18
 * Time: 7:21 PM
 */

namespace App\Services;

use App\Notification;
use App\User;
use App\Story;
use App\Tag;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Mockery\Exception;

class NotifBodyDecorator
{
    /**
     * @var PSDocBodyDecorator
     */
    protected $psDocBodyDecorator;

    public function __construct(PSDocBodyDecorator $psDocBodyDecorator)
    {
        $this->psDocBodyDecorator = $psDocBodyDecorator;

    }

    /**
     * @param Notification $ntf
     */
    public function decorate(Notification $ntf)
    {
        if (empty($ntf)) {
            return;
        }

        $ntf->action = $ntf->action();
        $ntf->target = $ntf->target();
        $ntf->isSubjectLost = $this->isSubjectLost($ntf);
        $ntf->isUserOwnAction = $this->isUserOwnAction($ntf->user_id, $ntf->action_type, $ntf->action_id);
        /*keeping the comment content*/
        $this->setNecessaryData($ntf->action, $ntf->action_type === 'comments', $ntf->action_type);
        $this->setNecessaryData($ntf->target, false, $ntf->target_type);
        if ($ntf->target_type === 'stories' && !empty($ntf->target) && $ntf->target->type === 'ps/doc') {
            $story = Story::find($ntf->target_id);
            $this->psDocBodyDecorator->decorate($story);
            $ntf->target = $story;
        }

    }

    /**
     * Subject is the core data or "thing" which the notification
     * is created around. For example in the case of new-story
     * the subject is the target, the story. in the case of new-like subject is combination
     * of both reaction and the target! Subject lost means that the subject is not
     * found in the db (or in its source). For instance, if user likes an article
     * but then later changes his mind; Now the notif entry exists but has lost its subject!
     *
     * @param Notification $ntf
     * @return bool
     */
    public function isSubjectLost(Notification $ntf)
    {
//        if (in_array($ntf->name, ['new-story'])) {
//            return empty($ntf->action());
//        } else

        if (in_array($ntf->name, ['new-like', 'new-comment', 'new-following', 'remove-following', 'new-story'])) {
            return empty($ntf->action()) || empty($ntf->action());
        }
        return false;
    }

    /**
     * @param $userId
     * @param null $actionType
     * @param null $actionId
     * @return bool
     */
    public function isUserOwnAction($userId, $actionType = null, $actionId = null)
    {
        $user = User::find($userId);
        $action = $this->getAction($actionType, $actionId);
        if (empty($user) || empty($action)) {
            return false;
        }

        return property_exists($action, 'user_id') && ($action->user_id == $userId);
    }


    private function setNecessaryData($item, $isCommentAction = false, $itemType = null)
    {
        if (empty($item)) {
            return;
        }

        if (property_exists($item, 'user_id')) {

            $item->user = $this->findOneUser($item->user_id);
        }
        if (property_exists($item, 'follower_id')) {
            $item->follower = $this->findOneUser($item->follower_id);
        }
        if (property_exists($item, 'tag_id')) {
            $item->tag = Tag::find($item->tag_id);
        }

        if (property_exists($item, 'story_id')) {
            $item->story = Story::find($item->story_id);
            if (!empty($item->story)) {
                $item->story->user;
                if (!empty($item->story->user)) {
                    unset($item->story->user->email);
                    unset($item->story->user->phone);
                }
                unset($item->story->content);
                unset($item->story->summary);
            }
        }

        if (property_exists($item, 'type') && $item->type === 'blog') {
            unset($item->content);

        }

        if (property_exists($item, 'summary')) {
            unset($item->summary);
        }
        /*when item is an instance of User model*/
        if (property_exists($item, 'email')) {
            unset($item->email);
        }
        /*when item is an instance of User model*/
        if (property_exists($item, 'phone')) {
            unset($item->phone);
        }
        /*when item is an instance of User model*/
        if (property_exists($item, 'remember_token')) {
            unset($item->remember_token);
        }
        /*when item is an instance of User model*/
        if (property_exists($item, 'password')) {
            unset($item->password);
        }
        if ($itemType === 'users') {
            $user = User::find($item->id);
            if (!empty($user)) {
                $user->followers;
                $item->followers_count = !empty($user->followers) ? $user->followers->count() : 0;
            }
        }

    }

    /**
     * @param null $actionType
     * @param null $actionId
     * @return null
     */
    private function getAction($actionType = null, $actionId = null)
    {
        if (empty($actionType) || empty($actionId)) {
            return null;
        }
        if (Schema::hasTable($actionType)) {
            return DB::table($actionType)
                ->where('id', $actionId)
                ->first();
        }
        return null;
    }

    private function findOneUser($id)
    {
        $user = User::find($id);
        if (!empty($user)) {
            $user->followers;
            $user->followers_count = !empty($user->followers) ? $user->followers->count() : 0;
            unset($user->followers);
            unset($user->email);
            unset($user->phone);
            if (property_exists($user, 'password')) {
                unset($user->password);
            }
            if (property_exists($user, 'remember_token')) {
                unset($user->remember_token);
            }
        }
        return $user;
    }
}