<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Story;
use App\Tag;
use App\Comment;
use App\User;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;

class TagController extends AwrAPICTR implements AwrRestfulController
{

    use CTRUtils;

    public function getModel()
    {
        return Tag::class;
    }

    public function onResult($res)
    {

    }

    public function listAll(Request $request, $key = null, $value = null)
    {

        $storyId = $request->query('story_id');
        $type = $request->query('type');
        if (empty($storyId) && empty($type)) {

            return parent::listAll($request, $key, $value);
        } else if (!empty($type) && empty($storyId)) {
            return $this->getModel()::where('name', 'LIKE', $type . ':%')
                ->get();
        }
        $story = Story::find($storyId);
        if (empty($story)) {
            return [];
        }
        $res = $story->tags->filter(function ($value, $key) use ($type) {
            return empty($type) || $this->startsWith($value->name, $type . ':');
        })->map(function ($value) {
            return $value->id;
        });
        return Tag::wherein('id', $res)->get();
    }

    /**
     * Only allowed for admins. The user_id must be specified.
     * We need to be careful with initial status value!
     * @param Request $request
     * @return Story
     */
    public function createOne(Request $request)
    {
        $storyId = $request['story_id'];
        $name = $request['name'];
        $tag = Tag::where('name', 'LIKE', $name)->first();
        $user = $request->user();
        if (empty($tag)) {
            $tag = new Tag();
            $tag->fill($request->all());
            $tag->save();
        };
        $story = Story::find($storyId);
        if (!empty($story) && $this->storyEditableByUser($user, $story) && !$this->storyHasTag($story, $tag)) {
            $story->tags()->save($tag);
        }
        return $tag;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required'
        ]);
    }

    public function updateValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @param  Request $request
     * @return \Illuminate\Http\Response | array
     */
    public function destroy(Request $request, $id)
    {
        $item = $this->findOne($request, $id);
        $fullyRemove = $request['fully_remove'];
        if (empty($fullyRemove)) {
            $fullyRemove = $request->query('fully_remove');
        }
        $storyId = $request['story_id'];
        if (empty($storyId)) {
            $storyId = $request->query('story_id');
        }
        $story = Story::find($storyId);
        $user = $request->user();
        $additionalCheck = $this->additionalRemoveCheck($request, $id);
        if (empty($item) || (!empty($story) && !$this->storyHasTag($story, $item))) {
            $err = ['message' => 'not found'];
            $err = $this->onRemoveError($request, $err, $id);
            return response()->json($err, 404);
        }
        if (!empty($fullyRemove) && ($fullyRemove === true || $fullyRemove === "true") && $this->isUserAdmin($user)) {
            $item->delete();
            return response()->json(['message' => 'item removed'], 202);
        } else if (!(empty($story) || empty($item)) && $additionalCheck && $this->storyHasTag($story, $item)) {
            $story->tags()->detach($item);
            return response()->json(['message' => 'tag removed from story'], 202);
        }
        $err = ['forbidden' => 'not allowed'];
        if (!$additionalCheck) {
            $err = $this->onRemoveError($request, $err, $id);
        } else {
            $err = ['message' => 'Admin force needed ( fully_remove < true > ) for fully removing the tag'];
        }
        $err['attr']=$fullyRemove;
        return response()->json($err, 403);
    }


    public function additionalCreateCheck(Request $request)
    {
        $storyId = $request['story_id'];
        if (empty($storyId)) {
            $storyId = $request->query('story_id');
        }
        $story = Story::find($storyId);
        if (empty($story)) {
            return true;
        }
        $user = $request->user();
        return $this->storyEditableByUser($user, $story);
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        return $this->additionalCreateCheck($request);
    }

    /**
     * Making sure only admins are able to edit the tag names as editing
     * a tag name can effect any story that uses that tag.
     * @param Request $request
     * @param $id
     * @return bool
     */
    public function additionalUpdateCheck(Request $request, $id)
    {
        $user = $request->user();
        return $this->isUserAdmin($user);
    }

    /**
     * Here would be nice to show enough information
     * for why it failed. The parent generic logic
     * does not cover this specific situation
     * @param Request $request
     * @param $err
     */
    public function onCreateError(Request $request, $err)
    {
        $storyId = $request['story_id'];
        $story = Story::find($storyId);
        $user = $request->user();
        if (!empty($story) && !$this->storyEditableByUser($user, $story)) {
            $err['forbidden'] = 'Operation not allowed for user';
        }
        return $err;
    }


    public function onRemoveError(Request $request, $err, $id)
    {
        return $this->onCreateError($request, $err);
    }

    public function onUpdateError(Request $request, $err, $id)
    {
        $user = $request->user();
        if (!$this->isUserAdmin($user)) {
            $err['forbidden'] = 'Only admins are allowed to do this!';
        }
        return $err;
    }

}
