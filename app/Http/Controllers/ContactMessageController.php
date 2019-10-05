<?php

namespace App\Http\Controllers;


use Validator;

use Illuminate\Http\Request;
use App\ContactMessage;
use App\Requester;
use App\Contracts\AwrRestfulController;


class ContactMessageController extends AwrAPICTR implements AwrRestfulController
{

    public function getModel()
    {
        return ContactMessage::class;
    }

    public function onResult($res)
    {
        $res->requester;
        $res->replies;
        foreach ($res->replies as $reply) {
            $reply->replier;
        }
        $res->noticedBy = $res->notifications();
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        /*
         *The key value should not be accepted here!
         */
        $head = $request->query('head_only');
        if ($head && $head === 'true') {
            return $this->head($request);
        }
        $type = $request->query('type', 'all');
        if ($type === 'newsletter') {
            return parent::listAll($request, 'type', 'newsletter');
        } else if ($type === 'contact') {
            return parent::listAll($request, 'type', 'contact');
        }
        return parent::listAll($request);
    }

    function createValidator(Request $request)
    {
        /*
         * If you do not want to use the validate method on the request, you may create a validator instance
         * manually using the Validator facade. The make method on
         * the facade generates a new validator instance:
         * */
        $request['allowed_types'] = ["contact", "career", "newsletter"];
        return Validator::make($request->all(), [
            'subject' => 'required|max:255',
            'content' => 'required',
            'type' => 'required|in_array:allowed_types.*',
            'name' => 'required',
            'email' => 'required|email'
        ]);
    }

    function updateValidator(Request $request)
    {
        /*
         * If you do not want to use the validate method on the request, you may create a validator instance
         * manually using the Validator facade. The make method on
         * the facade generates a new validator instance:
         * */
        $request['allowed_types'] = ["contact", "career", "newsletter"];
        return Validator::make($request->all(), [
            'subject' => 'required|max:255',
            'content' => 'required',
            'type' => 'required|in_array:allowed_types.*'
        ]);
    }

    public function createOne(Request $request)
    {
        $message = new ContactMessage();
        $requester = Requester::where('name', $request['name'])
            ->where('email', $request['email'])->first();
        $message->fill($request->all());
        if ($requester) {
            $oldPhone = $requester->phone;
            $requester->fill($request->all());
            if ($oldPhone && $oldPhone !== $requester->phone) {
                $requester->phone = $requester->phone . ', ' . $oldPhone;
            }
            $requester->update();
        } else {
            $requester = new Requester();
            $requester->fill($request->all());
            $requester->save();
        }
        $requester->messages()->save($message);
        $requester->messages;
        return $message;
    }
}
