<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Track;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;

class TrackController extends AwrAPICTR implements AwrRestfulController
{

    use CTRUtils;

    public function getModel()
    {
        return Track::class;
    }

    public function onResult($res)
    {
        $res->target = $res->target();
        $res->user;
        if (!empty($res->target) && $res->target_type === 'stories') {
            unset($res->target->content);
        }
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        return parent::listAll($request, [
            'user_id', 'target_type', 'target_id', 'name'], null);
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

    public function pulse(Request $request)
    {
        $pulse = $request['pulse'];
        if (!empty($pulse) && is_array($pulse)) {
            foreach ($pulse as $p) {

                $track = Track::find($p['id']);
                if ($track) {
                    $track->fill($p);
                    $track->update();
                }
            }
            return response()->json(['message' => 'All Items updated'], 201);
        }
        return response()->json(['forbidden' => 'Bad pulse set'], 403);
    }

}
