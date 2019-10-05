<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Reply;
use App\User;
use App\ContactMessage;
use App\Contracts\AwrRestfulController;

class ReplyController extends AwrAPICTR implements AwrRestfulController
{

    public function getModel()
    {
        return Reply::class;
    }

    public function onResult($res)
    {
        $res->replier;
        $res->contact_message;
    }

    /**
     * We need to be careful with initial status value!
     * @param Request $request
     * @return Reply
     */
    public function createOne(Request $request)
    {
        if ($request['status'] !== "draft") {
            $request['status'] = "waiting";
        }
        $item = new Reply();
        $item->fill($request->all());
        $item->save();
        return $item;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'subject' => 'required',
            'content' => 'required',
            'user_id' => 'required',
            'message_id' => 'required'
        ]);
    }

    public function updateValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'subject' => 'required',
            'content' => 'required',
            'user_id' => 'required',
            'message_id' => 'required'
        ]);
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

        if (!ContactMessage::find($request['message_id'])) {
            $err['contact_message'] = 'contact message not found';
        }
        if (!User::find($request['user_id'])) {
            $err['replier'] = 'The replier user not found';
        }

        return $err;
    }

    /**
     * Here would be nice to show enough information
     * for why it failed. The parent generic logic
     * does not cover this specific situation
     * @param Request $request
     * @param $err
     * @param $id
     */
    public function onUpdateError(Request $request, $err, $id)
    {
        $item = Reply::find($id);
        if($item && !($item->status === 'draft' || $item->status === 'waiting')){
            $err['late edit'] = 'It\'s too late for editing this item!' ;
        }
        if (!ContactMessage::find($request['message_id'])) {
            $err['contact_message'] = 'contact message not found';
        }
        if (!User::find($request['user_id'])) {
            $err['replier'] = 'The replier user not found';
        }
        return $err;
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        if (!$this->additionalRemoveCheck($request, $id)) {
            $err['message'] = 'Item cannot be removed at this point without using force!';
        }
        return $err;
    }

    public function additionalCreateCheck(Request $request)
    {
        return ContactMessage::find($request['message_id']) &&
            User::find($request['user_id']);
    }

    public function additionalUpdateCheck(Request $request, $id)
    {
        $item = Reply::find($id);
        if($item && !($item->status === 'draft' || $item->status === 'waiting')){
            return false;
        }
        return ContactMessage::find($request['contact_message_id']) &&
            User::find($request['user_id']);
    }

    /**
     * When item not found we should return true because
     * the reason for fail is not at this additional check!
     * @param Request $request
     * @param $id
     * @return bool
     */
    public function additionalRemoveCheck(Request $request, $id)
    {
        $item = Reply::find($id);
        if($item){
            return $request->query('force') === 'true' ||
                $item->status === 'draft' || $item->status === 'waiting';
        }
        return true;
    }

}
