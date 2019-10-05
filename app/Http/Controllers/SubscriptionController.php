<?php

namespace App\Http\Controllers;

use App\Services\AwrAppManager;
use Illuminate\Http\Request;
use App\Traits\CTRUtils;
use App\Contracts\NotifManager;

class SubscriptionController extends Controller
{
    use CTRUtils;

    /**
     * @var \App\Contracts\NotifManager
     */
    protected $notifManager;


    /**
     * @var AwrAppManager
     */
    protected $appManager;

    /**
     * MyBlogController constructor.
     * @param \App\Contracts\NotifManager $notifManager
     */
    function __construct(NotifManager $notifManager, AwrAppManager $appManager)
    {
        $this->notifManager = $notifManager;
        $this->appManager = $appManager;

    }

    /**
     * This one should be used over an open GET request
     *
     * @param Request $request
     * @param $userKey
     * @param $chainNameKey
     * @param $subscriptionKey
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function unsubscribe(Request $request, $userKey, $chainNameKey, $subscriptionKey)
    {
        $res = [];
        $user_key = $this->decodeItemShareId($userKey);
        $chain_name_key = $this->decodeItemShareId($chainNameKey);
        $sub_key = $this->decodeItemShareId($subscriptionKey);
        $alreadyUnsubscribed = false;
        if (!(empty($user_key) || empty($sub_key) || empty($chain_name_key)) &&
            $user_key->id && $sub_key->id && $sub_key->prefix && $chain_name_key->prefix && $chain_name_key->id) {
            $query = [
                'name' => $chain_name_key->id,
                'user_id' => $user_key->id,
                'target_type' => $sub_key->prefix,
                'target_id' => $sub_key->id
            ];
            if ($this->notifManager->isUnsubscribedFromNotifs($query)) {
                $alreadyUnsubscribed = true;
            } else {
                $this->notifManager->createUnsubscribeEntry($query);
            }
        }
        $context = $this->appManager->makeApp('home');
        $context->config['alreadyUnsubscribed'] = $alreadyUnsubscribed;
        $context->config['next'] = $this->getNextLinks();
        return view('unsubscribe', $context->config);
    }


    private function getNextLinks()
    {
        $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        return [
            0 => (object)[
                'name' => 'Awiar Profile',
                'href' => $server_root . '/profile/#welcome',
                'icon_img' => $server_root . '/assets/img/icons/profile_icon.png?v=33',
            ],
            1 => (object)[
                'name' => 'Awiar Read',
                'href' => $server_root . '/read/#index/everything?v=all&it_type=none&it_next=none&it=none',
                'icon_img' => $server_root . '/assets/img/icons/read_icon.png',
            ]
        ];
    }

}
