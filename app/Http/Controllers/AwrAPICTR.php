<?php

namespace App\Http\Controllers;

use App\Adapters\RestfulNotifsAdapter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use App\Contracts\NotifManager;
use App\Contracts\AwrRestfulController;
use App\Contracts\RestfulResourceNotifs;
use App\Services\AwrCTRHelper;
use App\Services\PSEmailManager;
use Illuminate\Http\Response;
use \Illuminate\Database\Eloquent\Collection;

abstract class AwrAPICTR extends Controller implements AwrRestfulController
{

    /**
     * @var NotifManager
     */
    protected $notifManager;


    /**
     * @var AwrCTRHelper
     */
    protected $ctrHelper;

    /**
     * @var RestfulResourceNotifs
     */
    protected $notifs;

    /**
     * @var string
     */
    protected $server_root;

    /**
     * @var Request
     */
    protected $request;

    /**
     * Options are index, show, destroy, update, store and head
     * @var string
     */
    protected $requestMethod;

    /**
     * AwrAPICTR constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     */
    function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper)
    {
        $this->notifManager = $notifManager;
        $this->ctrHelper = $awrCTRHelper;
        $this->server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $this->notifManager->setServerRoot($this->server_root);
        $this->notifs = $this->getNotifs();
        $this->request = null;
    }


    /**
     * @return Model
     */
    public abstract function getModel();

    /**
     * This function will be performed on each result!
     * @param $res
     */
    public abstract function onResult($res);


    public function isModelRelatedToAuthenticatedUser()
    {
        return false;
    }

    /**
     * @return RestfulResourceNotifs
     */
    public function getNotifs(): RestfulResourceNotifs
    {
        return new RestfulNotifsAdapter($this->notifManager);
    }

    /**
     * This function is used for listing all resources.
     * @param Request $request . The key value allows the generic impl to limit
     * the search using 'where'.
     * @param $key | array
     * @param $value
     * @return mixed
     */
    public function listAll(Request $request, $key = null, $value = null)
    {
        $model = $this->getModel();
        $orderRules = $this->getListOrderRules();
        return $this->ctrHelper->listAll($request, $model, $orderRules, $key, $value);

    }


    /**
     * Config object which decides what kind of ordering rules
     * should be applied on the listAll
     * @return object
     */
    public function getListOrderRules()
    {
        return $this->ctrHelper->getDefaultListOrderRules();
    }

    /**
     * This function is used for finding resource by its id.
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function findOne(Request $request, $id)
    {
        return $this->getModel()::find($id);
    }

    /**
     * Create one resource instance by calling fill with request.all()
     * @param Request $request
     * @return mixed
     */
    public function createOne(Request $request)
    {
        $clz = $this->getModel();
        return $this->ctrHelper->defaultCreateOne($request, $clz, $this->isModelRelatedToAuthenticatedUser());
    }

    /**
     * Update one resource instance by calling fill with request.all()
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function updateOne(Request $request, $id)
    {
        $item = $this->findOne($request, $id);
        if ($item) {
            $item->fill($request->all());
            $item->update();
        }
    }

    /**
     * @param Request $request
     * @param $id
     */
    public function removeOne(Request $request, $id){
        $item = $this->findOne($request, $id);
        $item->delete();
    }

    /**
     * This validator is used for creating a resource.
     * @param Request $request
     * @return mixed
     */
    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), []);
    }

    /**
     * This validator is used for updating the resources.
     * @param Request $request
     * @return mixed
     */
    public function updateValidator(Request $request)
    {
        return Validator::make($request->all(), []);
    }

    /**
     * @param Request $request
     * @param $err
     * @return mixed
     */
    public function onCreateError(Request $request, $err)
    {
        return $err;
    }

    /**
     * @param Request $request
     * @param $err
     * @param $id
     * @return mixed
     */
    public function onUpdateError(Request $request, $err, $id)
    {
        return $err;
    }

    /**
     * @param Request $request
     * @param $err
     * @param $id
     * @return mixed
     */
    public function onRemoveError(Request $request, $err, $id)
    {
        return $err;
    }

    /**
     * @param Request $request
     * @return boolean
     */
    public function additionalCreateCheck(Request $request)
    {
        return true;
    }

    /**
     * @param Request $request
     * @return boolean
     */
    public function additionalUpdateCheck(Request $request, $id)
    {
        return true;
    }

    /**
     * @param Request $request
     * @return boolean
     */
    public function additionalRemoveCheck(Request $request, $id)
    {
        return true;
    }

    /**
     * The HEAD request is almost identical to a GET request, they only differ
     * by a single fundamental aspect: the HEAD response should not include a payload (the actual data).
     *
     * This makes the HEAD HTTP verb fundamental for managing the validity of your current cached data.
     *
     * For now it allows the client to check the complete size
     * of items in db without actually requesting them.
     *
     * @param Request $request
     * @return Response |
     */
    public function head(Request $request)
    {
        $this->request = $request;
        $this->requestMethod = 'head';

        $last_update = $this->getModel()::orderBy('updated_at', 'DESC')->first();
        if ($last_update && isset($last_update['updated_at'])) {
            $last_update = $last_update['updated_at'];
        } else {
            $last_update = 'unknown';
        }
        return response()->json([
            'size' => $this->getModel()::count(),
            'updated_at' => $last_update
        ], 200);
    }

    /**
     * @param Request $request
     * @return Response | array|Collection|static[]
     */
    public function index(Request $request)
    {
        $this->request = $request;
        $this->requestMethod = 'index';

        $head = $request->query('head_only');
        if ($head && $head === 'true') {
            return $this->head($request);
        }
        $res = $this->listAll($request);
        $res->each(function ($m) {
            $this->onResult($m);
        });
        $this->notifs->notifyList($request, $res);
        return response()->json($res, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @param Request $request
     * @return Response | array
     */
    public function show(Request $request, $id)
    {
        $this->request = $request;
        $this->requestMethod = 'show';

        $res = $this->findOne($request, $id);
        if ($res) {
            $this->onResult($res);
            $this->notifs->notifyFindOne($request, $res);
            return response()->json($res, 200);
        } else {
            return response()->json(['error' => 'not found'], 404);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     *
     * @param Request $request
     * @return Response | array | object
     */
    public function store(Request $request)
    {
        $this->request = $request;
        $this->requestMethod = 'store';

        /*
        * If you do not want to use the validate method on the request, you may create a validator instance
        * manually using the Validator facade. The make method on
        * the facade generates a new validator instance:
        * */
        $validator = $this->createValidator($request);
        if ($validator->fails() || !$this->additionalCreateCheck($request)) {
            $res = [
                'status' => 400,
                'message' => 'The item body is not valid'
            ];

            $res['errors'] = $this->onCreateError($request, $validator->errors()->all());
            return response()->json($res, 400);
        }
        $this->notifs->notifyBeforeCreate($request);
        $item = $this->createOne($request);
        $this->notifs->notifyCreate($request, $item);
        return response()->json([
            'message' => 'Item created',
            'id' => $item->id], 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $this->request = $request;
        $this->requestMethod = 'update';
        $validator = $this->updateValidator($request);
        if ($validator->fails() || !$this->additionalUpdateCheck($request, $id)) {
            $res = [
                'status' => 400,
                'message' => 'The item body is not valid.'
            ];
            $res['errors'] = $this->onUpdateError($request, $validator->errors()->all(), $id);
            return response()->json($res, 400);
        }

        $item = $this->findOne($request, $id);
        if ($item) {
            $this->notifs->notifyBeforeUpdate($request, $item);
            $this->updateOne($request, $id);
            $this->notifs->notifyUpdate($request, $item);
            return response()->json(['message' => 'Item updated'], 201);
        }
        return response()->json(['message' => 'Item not found'], 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @param Request $request
     * @return Response | array
     */
    public function destroy(Request $request, $id)
    {
        $this->request = $request;
        $this->requestMethod = 'destroy';
        $item = $this->findOne($request, $id);
        if ($item && $this->additionalRemoveCheck($request, $id)) {
            $this->notifs->notifyBeforeRemove($request, $item);
            $this->removeOne($request, $id);
            $this->notifs->notifyRemove($request, $item);
            return response()->json(['message' => 'item removed'], 202);
        } else {
            $err = ['message' => 'not found'];
            $err = $this->onRemoveError($request, $err, $id);
            return response()->json($err, 404);
        }
    }

}
