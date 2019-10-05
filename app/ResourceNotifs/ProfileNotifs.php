<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/21/18
 * Time: 6:58 PM
 */

namespace App\ResourceNotifs;


use App\Adapters\RestfulNotifsAdapter;
use App\Contracts\RestfulResourceNotifs;
use Illuminate\Http\Request;
use App\Contracts\NotifManager;
use App\Comment;

//use Log

class ProfileNotifs extends RestfulNotifsAdapter implements RestfulResourceNotifs
{
    /**
     *  constructor.
     * @param NotifManager $notifManager
     */
    public function __construct(NotifManager $notifManager)
    {
        parent::__construct($notifManager);
    }

    public function notifyBeforeUpdate(Request $request, $resource)
    {
        $data = $request->all();
        if (!empty($data['name']) && $data['name'] !== $resource->name) {
            $this->notifManager->broadcastInApp('update-profile-name', 'profileName@string', $data['name'], 'users', $resource->id);
        }
    }


}