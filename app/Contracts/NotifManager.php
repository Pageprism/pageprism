<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/14/18
 * Time: 6:25 PM
 */

namespace App\Contracts;


use App\Services\EmailNotifManager;
use App\Services\InAppNotifManager;
use App\Services\PSEmailManager;

interface NotifManager extends NotificationService, InAppNotifier, EmailNotifier
{

    public function createUnsubscribeEntry($query);

    public function isUnsubscribedFromNotifs($query = []);

    public function getEmailNotifManager(): EmailNotifManager;

    public function getPSEmailManager(): PSEmailManager;

    public function getInAppNotifManager(): InAppNotifManager;


}