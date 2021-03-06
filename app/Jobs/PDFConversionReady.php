<?php

namespace App\Jobs;

use App\EmailData\PSDocEmailNotifData;
use App\User;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;



class PDFConversionReady extends GenericEmail implements ShouldQueue
{
    /**
     * NewPSDocNtfEmail constructor.
     * @param User $user
     * @param PSDocEmailNotifData $data
     */
    public function __construct(User $user, PSDocEmailNotifData $data)
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

        $template = 'emails.ps.convert_ready';
        $receiver = $this->emailResolver->resolve($this->user);
        $sender = $this->senderResolver->resolve();
        $mailer->send($template, (array)$this->data, function ($m) use ($receiver, $sender) {
            $m->from($sender->email, $sender->name);
            $m->to($receiver, $this->user->name)->subject('PDF conversion job completed');
        });
    }
}
