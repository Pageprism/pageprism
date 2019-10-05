<?php

namespace App\Jobs;

use App\User;
use App\EmailData\StoryEmailNotifData;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewStoryPublishedEmail extends GenericEmail implements ShouldQueue
{
    /**
     * Create a new job instance.
     *
     * @param  User $user
     * @param  $data
     */
    public function __construct(User $user, StoryEmailNotifData $data)
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

        //        $template = $this->templateResolver->getConfirmTplPath();
        $receiver = $this->emailResolver->resolve($this->user);
        $sender = $this->senderResolver->resolve();

        $mailer->send('emails.new_article', (array)$this->data, function ($m) use ($receiver, $sender) {
            $m->from($sender->email, 'Awiar Read');
//            if (!empty($this->user) && env('APP_ENV') == 'development') {
//                $this->user->email = 'ali.doori2@gmail.com';
//            }
            $m->to($receiver, $this->user->name)->subject('New article from the people you follow');
        });

        //outlook test
//        $mailData = new \App\StoryEmailNotifData(64,'http://localhost');
//        Mail::send('emails.new_article', (array)$mailData, function ($m){
//            $m->from('hello@awiarsolutions.com', 'Awiar Read');
//            $m->to('kavan.soleimanbeigi@helsinki.fi', 'kavan soleimanbeigi')->subject('New article from the people you follow');
//        });

    }
}
