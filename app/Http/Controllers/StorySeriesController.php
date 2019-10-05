<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\StorySeries;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;


class StorySeriesController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;


    public function isModelRelatedToAuthenticatedUser()
    {
        return false;
    }


    public function getModel()
    {
        return StorySeries::class;
    }


    public function onResult($res)
    {

    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'story_id' => 'required',
            'series_id' => 'required',
        ]);
    }

    public function updateValidator(Request $request)
    {
        return $this->createValidator($request);
    }

}
