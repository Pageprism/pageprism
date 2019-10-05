<?php

namespace App\EmailData;

use App\Traits\CTRUtils;
use App\Invite;

class InviteEmailData
{
    use CTRUtils;

    public $invite;

    public $reject_link;

    public $server_root;

    public function __construct(Invite $invite, $server_root)
    {
        $nxt = static::encodeItemShareId('/', '');
        $this->invite = $invite;
        $this->server_root = $server_root;
        $this->invite->inviter;
        $this->join_link = $server_root . '/insider/#auth?view=default&next=' . $nxt;
        $this->reject_link = $server_root . '/reject/' . static::encodeItemShareId($invite->id, 'invite');
    }
}