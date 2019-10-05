<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/14/18
 * Time: 10:27 PM
 */

namespace App\Contracts;


interface InAppNotifier
{

    public function broadcastInApp($name, $actionType = null, $actionId = null, $targetType, $targetId);

    public function notifyInApp($userId, $name, $actionType = null, $actionId = null, $targetType, $targetId);

    public function hintInApp($userId, $name, $hindData);

    public function isNotifiedInApp($query = []);

    public function createInAppNotifEntry($query);

}