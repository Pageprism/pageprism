<?php

namespace App\Jobs;

use App\EmailData\InviteEmailData;
use App\User;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Log;


class InviteEmail extends GenericEmail implements ShouldQueue
{

    /**
     * InviteEmail constructor.
     * @param InviteEmailData $data
     */
    public function __construct(InviteEmailData $data)
    {
        parent::__construct($data->invite->inviter, $data);
    }

    /**
     * Execute the job.
     *
     * @param  Mailer $mailer
     * @return void
     */
    public function handle(Mailer $mailer)
    {

        $template = 'emails.ps.invite';
        $receiver = $this->emailResolver->resolve($this->makeDummyUser((array)$this->data));
        $sender = $this->senderResolver->resolve();

        $mailer->send($template, (array)$this->data, function ($m) use ($receiver, $sender) {
            $m->from($sender->email, $sender->name);
            $m->to($receiver, $this->user->name)->subject('You are invited to join Pageshare');
        });
    }

    private function makeDummyUser($data){
        $user = new User();
        $user->fill([
            'name' => $data['invite']->name,
            'email' => $data['invite']->email
        ]);
        return $user;
    }
}
