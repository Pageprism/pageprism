<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\MainSeries;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use Illuminate\Support\Facades\Validator;


class MainCollectionController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;


    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }

    public function getModel()
    {
        return MainSeries::class;
    }


    public function onResult($res)
    {
        $res->series;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'type' => 'required',
            'series_id' => 'required'
        ]);
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        $user = $request->user();
        $item = MainSeries::find($id);
        return empty($item) || $item->user_id === $user['id'];
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        if (!$this->additionalRemoveCheck($request, $id)) {
            $err['message'] = 'Only user which owns this resource is allowed to do perform this action';
        }

        return $err;
    }

    public function createOne(Request $request)
    {
        $data = $request->all();
        $user = $request->user();
        if ($data['type'] === 'my_shelf') {
            MainSeries::where('user_id', $user['id'])
                ->where('type', 'my_shelf')
                ->get()
                ->each(function ($ms) {
                    $ms->delete();
                });
        }
        return parent::createOne($request);
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        $user = $request->user();
        return parent::listAll($request, ['user_id' => $user['id'], 'type'], $value);
    }
}
