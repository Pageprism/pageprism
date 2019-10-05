<?php

namespace App\Jobs;

use App\User;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Log;


class ConfirmEmail extends GenericEmail implements ShouldQueue
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

        $template = $this->templateResolver->getConfirmTplPath();
        $receiver = $this->emailResolver->resolve($this->user);
        $sender = $this->senderResolver->resolve();
        //'emails.welcome'

        $mailer->send($template, $this->data, function ($m) use ($receiver, $sender) {
            $m->from($sender->email, $sender->name);
            $m->to($receiver, $this->user->name)->subject('Email confirmation request');
        });
    }
}
