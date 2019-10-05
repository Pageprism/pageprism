<?php

namespace App\Http\Controllers;

use App\Contracts\RestfulResourceNotifs;
use App\ResourceNotifs\PSDocNotifs;
use App\Series;
use App\Services\PSDocBodyDecorator;
use Illuminate\Http\Request;

use App\user;
use App\Story;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use App\Services\AwrCTRHelper;
use App\Services\PSDocService;
use App\Contracts\NotifManager;
use App\Services\CanUser;
use Illuminate\Support\Facades\Validator;


class MyPSDocController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    /**
     * @var PSDocService
     */
    protected $docService;

    /**
     * @var PSDocBodyDecorator
     */
    protected $docDecorator;

    /**
     * @var CanUser
     */
    protected $canUser;

    /**
     * MyPSDocController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param PSDocService $docService
     * @param PSDocBodyDecorator $docDecorator
     * @param CanUser $canUser
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper, PSDocService $docService,
                                PSDocBodyDecorator $docDecorator, CanUser $canUser)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->docService = $docService;
        $this->docDecorator = $docDecorator;
        $this->canUser = $canUser;

    }

    public function getNotifs(): RestfulResourceNotifs
    {
        return new PSDocNotifs($this->notifManager);
    }


    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }


    public function getModel()
    {
        return Story::class;
    }


    public function onResult($res)
    {
        $this->docDecorator->decorate($res);
    }


    public function createOne(Request $request)
    {
        $user = $request->user();
        $data = $request->all();
        $meta = !empty($data['meta']) ? (array)$data['meta'] : [];
        $setting = !empty($data['settings']) ? (array)$data['settings'] : [];
        $tags = !empty($data['tags']) ? $data['tags'] : [];
        return $this->docService->create($user->id, $data, $meta, $setting, $tags);
    }

    public function updateOne(Request $request, $id)
    {
        $data = $request->all();
        $meta = !empty($data['meta']) ? (array)$data['meta'] : [];
        $setting = !empty($data['settings']) ? (array)$data['settings'] : [];
        $tags = !empty($data['tags']) ? $data['tags'] : [];

        $item = $this->findOne($request, $id);
        if ($item) {
            $this->docService->save($item->id, $item->user_id, $data, $meta, $setting, $tags);
        }
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'title' => 'required',
            'collection_id' => 'required'
        ]);
    }

    public function additionalCreateCheck(Request $request)
    {
        if (!$this->hasCollection($request)) {
            return false;
        }
        $user = $request->user();
        $data = $request->all();
        $coll = Series::find($data['collection_id']);
        return $this->canUser->createPSDocsInCollection($user, $coll);
    }

    public function additionalUpdateCheck(Request $request, $id)
    {
        $user = $request->user();
        $doc = Story::find($id);
        return $this->canUser->editPSDoc($user, $doc);
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        return $this->additionalUpdateCheck($request, $id);
    }


    public function onCreateError(Request $request, $err)
    {
        if (!$this->hasCollection($request)) {
            $err['message'] = 'New doc requires a collection but it does not exist.';
        } else if (!$this->additionalCreateCheck($request)) {
            $err['message'] = 'Not enough access right for creating docs in this collection.';
        }
        return $err;
    }

    public function onUpdateError(Request $request, $err, $id)
    {
        if (!$this->additionalUpdateCheck($request, $id)) {
            $err['message'] = 'Not enough access right from editing / removing this resource.';
        }
        return $err;
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        return $this->onUpdateError($request, $err, $id);
    }


    public function findOne(Request $request, $id)
    {
        $user = $request->user();

        $item = Story::where('id', $id)
            ->where('type', 'ps/doc')
            ->where('content_type', 'multi-image/pages')
            ->first();

        if (!empty($item) &&
            ($item->status === 'published' ||
                $this->canUser->editPSDoc($user, $item))) {
            return $item;
        }
        return null;
    }

    public function removeOne(Request $request, $id)
    {
        $this->docService->remove($id);
    }


    public function listAll(Request $request, $key = null, $value = null)
    {
        $user = $request->user();
        return parent::listAll($request, [
            'type' => 'ps/doc',
            'content_type' => 'multi-image/pages',
            'user_id' => $user->id
        ], null);
    }

    private function hasCollection(Request $request)
    {
        $data = $request->all();
        if (empty($data['collection_id'])) {
            return false;
        }
        $coll = Series::where('type', 'ps/collection')->where('id', $data['collection_id'])->first();
        return !empty($coll);
    }
}
