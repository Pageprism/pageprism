<?php

namespace App\Jobs;

use App\User;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Log;


class PersonJoinedEmail extends GenericEmail implements ShouldQueue
{
    /**
     * Create a new job instance.
     *
     * @param  User $user
     * @param  $data
     */
    public function __construct(User $user, $data = [])
    {
        parent::__construct($user, $data);
    }

    /**
     * Execute the job.
     *
     * @param  Mailer $mailer
     * @return void
     */
    public function handle(Mailer $mailer)
    {

        $template = $this->templateResolver->getPersonJoinedTplPath();
        $receiver = $this->emailResolver->resolve($this->user);
        $sender = $this->senderResolver->resolve();
        $person = $this->data['person'];
        $mailer->send($template, $this->data, function ($m) use ($receiver, $sender, $person) {
            $m->from($sender->email, $sender->name);
            $m->to($receiver, $this->user->name)->subject(UCWORDS($person->name) . ' has joined the platform');
        });
    }
}
