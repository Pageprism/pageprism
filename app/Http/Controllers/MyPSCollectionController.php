<?php

namespace App\Http\Controllers;

use App\Services\PSDocBodyDecorator;
use App\Services\PSDocService;
use Illuminate\Http\Request;
use App\PSPublisher;
use App\Series;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use App\Services\AwrCTRHelper;
use App\Contracts\NotifManager;
use App\Services\CanUser;
use Illuminate\Support\Facades\Validator;


class MyPSCollectionController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    /**
     * @var PSDocBodyDecorator
     */
    protected $docDecorator;

    /**
     * @var PSDocService
     */
    protected $docService;
    /**
     * @var CanUser
     */
    protected $canUser;

    /**
     * MyPSCollectionController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param PSDocBodyDecorator $docDecorator
     * @param CanUser $canUser
     * @param PSDocService $docService
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper,
                                PSDocBodyDecorator $docDecorator, CanUser $canUser,
                                PSDocService $docService)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->docDecorator = $docDecorator;
        $this->canUser = $canUser;
        $this->docService = $docService;
    }

    public function isModelRelatedToAuthenticatedUser()
    {
        return false;
    }


    public function getModel()
    {
        return Series::class;
    }


    public function onResult($res)
    {
        $user = $this->request->user();
        if (!empty($res->stories)) {
            $stories = $res->stories->filter(function ($s) use ($user) {
                return $s->status === 'published' ||
                    $this->canUser->editPSDoc($user, $s);
            })->flatten();
            $stories->each(function ($s) {
                $this->docDecorator->decorateForList($s);
            });
            //unset($res->stories);
            //$res->stories = $stories;
            $res->setRelation('stories', $stories);
        }
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required',
        ]);
    }

    public function findOne(Request $request, $id)
    {
        return Series::where('id', $id)
            ->where('type', 'ps/collection')
            ->first();
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        return parent::listAll($request, ['type' => 'ps/collection', 'user_id', 'status'], null);
    }

    public function additionalCreateCheck(Request $request)
    {
        $user = $request->user();
        $data = $request->all();
        $publisher = PSPublisher::find($data['publisher_id']);
        if (!empty($publisher)) {
            return $this->canUser->createPSCollectionsForPublisher($user, $publisher);
        }
        return $this->canUser->createPersonalCollections($user);

    }

    public function additionalUpdateCheck(Request $request, $id)
    {
        $item = Series::find($id);
        $user = $request->user();
        if (empty($item)) {
            return false;
        }
        if (!empty($item->publisher)) {
            return $this->canUser->editPSCollectionsForPublisher($user, $item->publisher);
        }
        return $this->canUser->editPersonalCollections($user);
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        return $this->additionalUpdateCheck($request, $id);
    }

    public function onCreateError(Request $request, $err)
    {
        if (!$this->additionalCreateCheck($request)) {
            $err['message'] = 'Not enough rights for [ create ] operation with collections.';
        }
        return $err;
    }

    public function onUpdateError(Request $request, $err, $id)
    {
        if (!$this->additionalUpdateCheck($request, $id)) {
            $err['message'] = 'Not enough access rights for [ edit / delete] operations with collections.';
        }
        return $err;
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        return $this->onUpdateError($request, $err, $id);
    }


    public function createOne(Request $request)
    {
        $user = $request->user();
        $data = $request->all();
        $publisher = PSPublisher::find($data['publisher_id']);
        $data['type'] = 'ps/collection';
        if (!empty($publisher)) {
            $data['user_id'] = $publisher->user_id;
        } else {
            $data['user_id'] = $user['id'];
        }
        $item = new Series();
        $item->fill($data);
        $item->save();
        return $item;
    }

    public function updateOne(Request $request, $id)
    {
        $data = $request->all();
        $publisher = PSPublisher::find($data['publisher_id']);
        $data['type'] = 'ps/collection';
        if (!empty($publisher)) {
            $data['user_id'] = $publisher->user_id;
        } else {
            unset($data['user_id']);
        }
        $item = Series::find($id);
        $item->fill($data);
        $item->save();
        return $item;

    }

    public function removeOne(Request $request, $id)
    {
        $this->docService->removeCollection($id);
    }


}
