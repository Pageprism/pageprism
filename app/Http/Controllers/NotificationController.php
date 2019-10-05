<?php

namespace App\Http\Controllers;

use App\Jobs\SocketClientCleanup;
use Log;
use Illuminate\Http\Request;
use App\Contracts\AwrRestfulController;
use App\Notification;
use App\User;
use App\Story;
use App\Contracts\NotifManager;
use App\Services\NotifBodyDecorator;
use Illuminate\Support\Carbon;
use App\Services\AwrCTRHelper;


class NotificationController extends AwrAPICTR implements AwrRestfulController
{

    /**
     * @var NotifBodyDecorator
     */
    protected $notifBodyDecorator;

    /**
     * NotificationController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param NotifBodyDecorator $notifBodyDecorator
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper, NotifBodyDecorator $notifBodyDecorator)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->notifBodyDecorator = $notifBodyDecorator;
    }

    public function getModel()
    {
        return Notification::class;
    }

    public function onResult($res)
    {
        $this->notifBodyDecorator->decorate($res);
    }

    public function addSeenItems(Request $request)
    {

        $user = $request->user();
        $data = $request->all();
        $dataOk = isset($data['seen']) && isset($data['not_seen']) && is_array($data['seen']) && is_array($data['not_seen']);
        if (!$dataOk) {
            return response()->json(['message' => 'bad request', 'reason' => 'Request body should include arrays seen and not_seen'], 400);
        }
        foreach ($data['seen'] as $id) {
            $ntf = Notification::find($id);
            if (!empty($ntf)) {
                $ntf->seen = Carbon::now();
                $ntf->save();
            }
        }
        /*ignoring permanently saving not_seen values for now */
        $res = ['seen' => $data['seen'], 'not_seen' => $data['not_seen']];
        $this->notifManager->hintInApp($user['id'], 'seen-notifs', $res);
        return response()->json($res, 200);
    }

    public function listAll(Request $request, $key = null, $value = null)
    {

        $user = $request->user();
        $limit = $request->query('limit');
        /*Note: return only user's own notifs*/
        $request->query('user_id', $user->id);
        /*Note the items without values will be be picked from query string*/
        $search = ['user_id' => $user->id, 'target_type', 'action_type', 'name'];
        $result = parent::listAll($request, $search, null)
            ->filter(function ($nxt) {
                /*omitting if the subject data cannot be found*/
                return !$this->notifBodyDecorator->isSubjectLost($nxt);
            })
            ->flatten();

        if (!empty($limit)) {
            return $result->take($limit);
        }
        return $result;
    }

    public function getListOrderRules()
    {
        return (object)[
            'order' => true,
            'isDesc' => true,
            'orderKey' => 'created_at'
        ];
    }


}
