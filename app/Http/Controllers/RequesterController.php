<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use App\Requester;
use App\Contracts\AwrRestfulController;


class RequesterController extends AwrAPICTR implements AwrRestfulController
{


    public function getModel()
    {
        return Requester::class;
    }

    public function onResult($res)
    {
        $res->messages;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email'
        ]);
    }
    public function updateValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email'
        ]);
    }

    public function createOne(Request $request)
    {
        $requester = Requester::where('name', $request['name'])
            ->where('email', $request['email'])->first();
        if ($requester) {
            $requester->fill($request->all());
            $requester->update();
        }else{
            $requester = new Requester();
            $requester->fill($request->all());
            $requester->save();
        }

        return $requester;
    }

}
