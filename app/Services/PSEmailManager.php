<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/14/18
 * Time: 5:58 PM
 */

namespace App\Services;

use App\EmailData\InviteEmailData;
use App\EmailData\PSDocEmailNotifData;
use App\Jobs\InviteEmail;
use App\Jobs\NewPSDocNtfEmail;
use App\Jobs\PDFConversionReady;
use App\Traits\PSNotifUtils;
use App\Contracts\EmailNotifier;
use Illuminate\Foundation\Bus\DispatchesJobs;
use App\Invite;
use App\Story;
use Illuminate\Support\Facades\Log;



class PSEmailManager implements EmailNotifier
{

    use DispatchesJobs, PSNotifUtils;

    /**
     * @var EmailNotifManager
     */
    protected $emailNotifManager;
    /**
     * @var string
     */
    protected $server_root;

    /**
     * PSEmailManager constructor.
     * @param EmailNotifManager $emailNotifManager
     */
    function __construct(EmailNotifManager $emailNotifManager)
    {
        $this->emailNotifManager = $emailNotifManager;
        if(isset($_SERVER['HTTP_HOST']) && !empty($_SERVER['HTTP_HOST'])){
            $this->server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        }

    }

    public function setServerRoot($serverRoot){
        $this->server_root = $serverRoot;
    }

    public function sendInviteEmail(Invite $invite)
    {
        $emailData = new InviteEmailData($invite, $this->server_root);
        $query = [
            'user_id' => $invite->inviter->id,
            'name' => 'invite-email-to-' . $invite->email,
            'target_type' => 'invites',
            'target_id' => $invite->id
        ];
        if (!$this->isNotifiedByEmail($query)) {
            $this->createEmailNotifEntry($query);
            $this->dispatch(new InviteEmail($emailData));
        }
    }

    public function notifyConversionJobReady(Story $doc, $jobId)
    {
        $user = $doc->user;
        $query = [
            'user_id' => $user->id,
            /*
             * adding jobId turned out to be bad idea as laravel might
             * try to call with different job ids for single request
             * even when the job has completed without any error!
             * For solving this issue instead of job id we make the convert service to
             * remove associated email notif row before each convert call!
             * */
            //'name' => 'pdf-convert-' . $jobId,
            'name' => 'pdf-convert-job',
            'target_type' => 'stories',
            'target_id' => $doc->id
        ];
        $emailData = new PSDocEmailNotifData($doc->id, $this->server_root);
        if (!$this->isNotifiedByEmail($query)) {
            $this->createEmailNotifEntry($query);
            $this->dispatch(new PDFConversionReady($user, $emailData));
        }
    }

    public function notifySubscriberAboutNewDoc(Story $doc)
    {
        $emailData = new PSDocEmailNotifData($doc->id, $this->server_root);
        $users = $this->getSubscribers($doc->tags)->filter(function ($u) use ($doc) {
            return $u->id !== $doc->user_id;
        });
        $users->each(function ($u) use ($emailData, $doc) {
            $query = [
                'user_id' => $u->id,
                'name' => 'new-ps-doc-ntf',
                'target_type' => 'stories',
                'target_id' => $doc->id
            ];
            if (!$this->isNotifiedByEmail($query)) {
                $this->createEmailNotifEntry($query);
                $this->dispatch(new NewPSDocNtfEmail($u, $emailData));
            }
        });
    }


    public function createEmailNotifEntry($query)
    {
        return $this->emailNotifManager->createEmailNotifEntry($query);
    }

    public function isNotifiedByEmail($query = [])
    {
        return $this->emailNotifManager->isNotifiedByEmail($query);
    }


}