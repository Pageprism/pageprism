<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/14/18
 * Time: 10:27 PM
 */

namespace App\Contracts;


interface EmailNotifier
{

    public function createEmailNotifEntry($query);

    public function isNotifiedByEmail($query = []);

}