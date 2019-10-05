<?php

namespace App\Http\Controllers;

use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\SkillNotifs;
use Validator;
use Illuminate\Http\Request;
use App\User;
use App\Tag;
use App\Skill;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;


class SkillController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }

    public function getModel()
    {
        return Skill::class;
    }

    public function onResult($res)
    {
        $res->user;
        $res->tag;
        $res->name = $res->tag->name;
        unset($res->tag);
        if (!empty($res->user)) {
            unset($res->user->email);
            unset($res->user->phone);
        }
    }

    public function getNotifs(): RestfulResourceNotifs
    {
        return new SkillNotifs($this->notifManager);
    }


    public function createOne(Request $request)
    {
        $name = $request['name'];
        $tag = Tag::where('name', 'LIKE', $name)->first();
        $user = $request->user();

        if (empty($tag)) {
            $tag = new Tag();
            $tag->fill($request->all());
            $tag->save();
        };

        $skill = new Skill();
        $skill->user_id = $user->id;
        $skill->tag_id = $tag->id;
        $skill->save();
        return $skill;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'user_id' => 'required',
            'name' => 'required'
        ]);
    }

    public function updateValidator(Request $request)
    {
        return $this->createValidator($request);
    }

    public function additionalCreateCheck(Request $request)
    {

        $user = $request->user();
        $name = $request['name'];
        $user_id = $request['user_id'];
        $exists = Skill::where('user_id', $user_id)
                ->get()
                ->filter(function ($s) use ($name) {
                    return $s->tag->name === $name;
                })
                ->count() > 0;

        return $request['user_id'] === $user['id'] && !$exists;
    }

    public function additionalUpdateCheck(Request $request, $id)
    {
        $item = Skill::find($id);
        $user = $request->user();
        return $item->user_id === $user['id'];
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        return $this->additionalUpdateCheck($request, $id);
    }

    public function onCreateError(Request $request, $err)
    {
        if (!$this->additionalCreateCheck($request)) {
            $err['forbidden'] = 'Users are allowed to add skill entries only for their own profiles. ';
            $err['note'] = 'Each skill can be added only once.';
        }
        return $err;
    }

    public function onUpdateError(Request $request, $err, $id)
    {
        if (!$this->additionalUpdateCheck($request, $id)) {
            $err['forbidden'] = 'The operation is allowed only by the profile owner.';
        }
        return $err;
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        return $this->onUpdateError($request, $err, $id);
    }
}
