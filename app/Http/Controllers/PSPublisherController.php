<?php

namespace App\Http\Controllers;

use App\PSPublisher;
use App\Services\PSDocService;
use App\User;
use Illuminate\Http\Request;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use App\Contracts\NotifManager;
use App\Services\AwrCTRHelper;
use App\Services\CanUser;
use Illuminate\Support\Facades\Validator;


class PSPublisherController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    /**
     * @var CanUser
     */
    protected $canUser;

    /**
     * @var PSDocService
     */
    protected $docService;

    /**
     * PSPublisherController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param CanUser $canUser
     * @param PSDocService $docService
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper,
                                CanUser $canUser, PSDocService $docService)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->canUser = $canUser;
        $this->docService = $docService;

    }

    public function isModelRelatedToAuthenticatedUser()
    {
        return false;
    }


    public function getModel()
    {
        return PSPublisher::class;
    }


    public function onResult($res)
    {
        $res->user;
        $res->moderators = $res->moderators();
        $res->creators = $res->creators();
        $res->collections;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'user_id' => 'required',
            'name' => 'required'
        ]);
    }

    public function additionalCreateCheck(Request $request)
    {
        $user = $request->user();
        $owner = $this->getDataUserById($request);
        return !empty($owner)
            && $this->canUser->createPublisher($user);
    }


    public function onCreateError(Request $request, $err)
    {
        if (!$this->additionalCreateCheck($request)) {
            $message = 'Publisher can be created only by an admin user.';
            if (empty($this->getDataUserById($request))) {
                $message = 'An assignee account is required as < user_id >';
            }
            $err['message'] = $message;
        }
        return $err;
    }


    public function additionalUpdateCheck(Request $request, $id)
    {
        $publisher = PSPublisher::find($id);
        $user = $request->user();
        $data = $request->all();
        if (empty($publisher)) {
            return true;
        }
        /*Organization ownership transfer not allowed here!*/
        if ($data['user_id'] !== $publisher->user_id) {
            return false;
        }
        return $this->canUser->updatePublisher($user, $publisher);
    }

    public function onUpdateError(Request $request, $err, $id)
    {
        if (!$this->additionalUpdateCheck($request, $id)) {
            $err['message'] = 'Only admins, owners and organisation moderators are allowed to update.';
            $err['Info'] = 'Note that ownership transfer is not allowed with update.';
        }
        return $err;
    }

    public function additionalRemoveCheck(Request $request, $id)
    {
        $publisher = PSPublisher::find($id);
        $user = $request->user();
        if (empty($publisher)) {
            return true;
        }
        return $this->canUser->removePublisher($user, $publisher);
    }

    public function onRemoveError(Request $request, $err, $id)
    {
        if (!$this->additionalRemoveCheck($request, $id)) {
            $err['message'] = 'Only admins, owners and organisation moderators are allowed to remove.';
        }
        return $err;
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        /*limit user's own organizations only if specified in the params*/
        return parent::listAll($request, ['user_id'], $value);
    }

    private function getDataUserById(Request $request)
    {
        $data = $request->all();
        return User::find($data['user_id']);
    }

    public function removeOne(Request $request, $id)
    {
        $item = PSPublisher::find($id);
        if (empty($item)) {
            return;
        }
        $item->collections->each(function ($coll) {
            $this->docService->removeCollection($coll->id);
        });
        $item->delete();
    }


}
