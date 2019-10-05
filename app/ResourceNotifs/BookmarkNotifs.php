<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/21/18
 * Time: 6:58 PM
 */

namespace App\ResourceNotifs;

use App\Services\EmailNotifManager;
use App\Services\PSEmailManager;
use Log;
use App\Adapters\RestfulNotifsAdapter;
use App\Contracts\RestfulResourceNotifs;
use Illuminate\Http\Request;
use App\Contracts\NotifManager;
use App\OncePublishedStory;
use App\Comment;
use App\Reaction;
use App\ReactionType;
use App\Traits\CTRUtils;
use App\Traits\StoryImages;

class BookmarkNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
{
    use CTRUtils, StoryImages;

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
        $user = $request->user();
        if (empty($user)) {
            return;
        }
        $this->onResult($resource);
        $this->notifManager->hintInApp($user->id, 'new-bookmark', (object)['bookmark' => $resource]);
    }

    public function notifyRemove(Request $request, $resource)
    {
        $user = $request->user();
        if (empty($user)) {
            return;
        }
        $this->onResult($resource);
        $this->notifManager->hintInApp($user->id, 'remove-bookmark', (object)['bookmark' => $resource]);
    }

    private function onResult($res)
    {
        $res->story;
        if (empty($res->story)) {
            return;
        }
        unset($res->story->content);
        $like = ReactionType::where('name', 'like')->first();
        $res->story->comments_count = Comment::where('parent_id', null)->where('story_id', $res->story->id)->count();
        $res->story->reactions;
        foreach ($res->story->reactions as $r) {
            $r->type;
            $r->user;
            $r->name = $r->type->name;
            $r->user_name = $r->user->name;
            $r->user_picture = $r->user->picture;
            $r->user_title = $r->user->title;
            unset($r->type);
            unset($r->user);
        }

        if (!empty($like)) {
            $res->story->likes_count = Reaction::where('story_id', $res->story->id)->where('reaction_type_id', $like->id)->count();
        } else {
            $res->story->likes_count = 0;
        }
        $res->story->images = $this->getImageList($res->story->id);
        $res->story->user;
        if (!empty($res->story->user)) {
            unset($res->story->user->email);
            unset($res->story->user->phone);
        }
    }
}