<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/14/18
 * Time: 5:58 PM
 */

namespace App\Services;

use Log;
use App\NotifChainExclusion;

class GenericNotifService
{

    /**
     * Server root is needed by some managers such as EmailNotifManager
     * are often are set through the controller
     * @var string
     */
    protected $server_root;

    function __construct()
    {

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

    public function setServerRoot($server_root)
    {
        $this->server_root = $server_root;
    }

    public function notifyUserAboutStoryLike($user, $storyId, $reactionId)
    {
        //empty works as adapter
    }

    public function notifyStoryAuthorAboutLike($storyId, $commentId)
    {
        //empty works as adapter

    }

    public function notifyStoryAudienceAboutLike($storyId, $reactionId)
    {
        //empty works as adapter

    }

}