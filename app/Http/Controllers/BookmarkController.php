<?php

namespace App\Http\Controllers;

use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\BookmarkNotifs;
use Illuminate\Http\Request;
use SebastianBergmann\Comparator\Book;
use Validator;
use App\Story;
use App\Bookmark;
use App\Comment;
use App\Reaction;
use App\ReactionType;
use App\User;
use App\Traits\CTRUtils;
use App\Traits\StoryImages;
use App\Contracts\AwrRestfulController;
use App\Services\PSDocBodyDecorator;
use App\Contracts\NotifManager;
use App\Services\AwrCTRHelper;

class BookmarkController extends AwrAPICTR implements AwrRestfulController
{

    use CTRUtils, StoryImages;
    /**
     * @var PSDocBodyDecorator
     */
    protected $docDecorator;

    /**
     * BookmarkController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param PSDocBodyDecorator $docDecorator
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper,
                                PSDocBodyDecorator $docDecorator)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->docDecorator = $docDecorator;
    }

    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }

    public function getModel()
    {
        return Bookmark::class;
    }

    public function getNotifs(): RestfulResourceNotifs
    {
        return new BookmarkNotifs($this->notifManager);
    }


    public function onResult($res)
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
        if ($res->story->type === 'ps/doc') {
            $this->docDecorator->decorate($res->story);
        }
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        $user = $request->user();
        return $this->getModel()::where('user_id', $user['id'])->get();
    }


    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'story_id' => 'required'
        ]);
    }

    public function updateValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'story_id' => 'required'
        ]);
    }

    public function additionalCreateCheck(Request $request)
    {
        $user = $request->user();
        $story = Story::find($request['story_id']);
        if (empty($story)) {
            return false;
        }
        $count = Bookmark::where('user_id', $user['id'])->where('story_id', $story->id)->count();
        if ($count > 0) {
            return false;
        }
        return true;
    }


    public function onCreateError(Request $request, $err)
    {
        $user = $request->user();
        $story = Story::find($request['story_id']);
        if (empty($story)) {
            $err['bad story'] = 'Story should exist';
        } else {
            $count = Bookmark::where('user_id', $user['id'])->where('story_id', $story->id)->count();
            if ($count > 0) {
                $err['duplicate'] = 'Story & User must be unique';
            }
        }
        return $err;
    }

    public function additionalUpdateCheck(Request $request, $id)
    {
        return false;
    }

    public function onUpdateError(Request $request, $err, $id)
    {
        $err['forbidden'] = 'Operation < Update > no allowed with resource < bookmark >';
        return $err;
    }


}
