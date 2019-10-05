<?php

namespace App\Http\Controllers;

use App\TagSubscription;
use Illuminate\Http\Request;
use Validator;
use App\Tag;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use App\Services\AwrCTRHelper;


class TagSubscriptionController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;


    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }


    public function getModel()
    {
        return TagSubscription::class;
    }


    public function onResult($res)
    {
        $res->user;
        $res->tag;
        $res->name = $res->tag->name;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required',
            'type' => 'required'
        ]);
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        $user = $request->user();
        return parent::listAll($request, [
            'user_id' => $user['id']
        ], $value);
    }

    public function additionalCreateCheck(Request $request)
    {
        $data = $request->all();
        $user = $request->user();
        $tag = Tag::where('name', $data['name'])->first();
        if (empty($tag)) {
            return true;
        }
        $tag = $this->getTag($data['name']);
        $item = TagSubscription::where('tag_id', $tag->id)
            ->where('user_id', $user['id'])->first();

        return empty($item);
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        $user = $request->user();
        $item = TagSubscription::find($id);

        return empty($item) || $item->user_id === $user['id'];
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        if (!$this->additionalRemoveCheck($request, $id)) {
            $err['message'] = 'Only the item owner is allowed to remove.';
        }
        return $err;
    }

    public function onCreateError(Request $request, $err)
    {

        if (!$this->additionalCreateCheck($request)) {
            $err['message'] = 'Item already exists for user.';
        }
        return $err;
    }

    public function createOne(Request $request)
    {
        $user = $request->user();
        $data = $request->all();
        $tag = $this->getTag($data['name']);
        $item = new TagSubscription();
        $item->fill([
            'type' => $data['type'],
            'tag_id' => $tag->id,
            'user_id' => $user['id']
        ]);
        $item->save();
        return $item;
    }

    private function getTag($name)
    {
        $tag = Tag::where('name', $name)->first();
        if (empty($tag)) {
            $tag = new Tag();
            $tag->fill([
                'name' => $name
            ]);
            $tag->save();
        }
        return $tag;
    }


}
