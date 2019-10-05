<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/15/18
 * Time: 1:17 PM
 */

namespace App\Jobs;

use App\User;
use App\Services\EmailTemplatePathResolver;
use App\Services\EmailReceiverResolver;
use App\Services\EmailSenderResolver;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

abstract class GenericEmail implements ShouldQueue
{

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;

    protected $data;

    protected $templateResolver;

    protected $emailResolver;

    protected $senderResolver;

    protected $server_root;

    /**
     * Create a new job instance.
     *
     * @param  User $user
     * @param  $data
     */
    public function __construct(User $user, $data = [])
    {
        //
        $this->user = $user;
        $this->data = $data;
        $this->templateResolver = new EmailTemplatePathResolver();
        $this->emailResolver = new EmailReceiverResolver();
        $this->senderResolver = new EmailSenderResolver();
        //do not resolve server_root as it will fail in async jobs!
//        $this->server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        if(empty($data)){
            $this->data = [];
        }
//        if(is_array($this->data)){
//            $this->data['server_root'] = $this->server_root;
//        }else if(is_object($this->data)){
//            $this->data->server_root = $this->server_root;
//        }

    }
}