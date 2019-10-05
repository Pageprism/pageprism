<?php


namespace App\Services;


use App\User;


class EmailReceiverResolver
{


    public function __construct()
    {

    }


    public function resolve(User $user)
    {

        if ($this->hasDefaultAsReceiver($user)) {
            return env('DEFAULT_EMAIL_RECEIVER');
        }
        return $user->email;
    }

    private function hasDefaultAsReceiver(User $user)
    {
        if (empty($user) ||
            empty($user->email) ||
            env('APP_ENV') == 'local' ||
            (env('APP_ENV') == 'development' &&
                (
                    $this->endsWith($user->email, '@example.net') ||
                    $this->endsWith($user->email, '@example.com')
                )
            )) {
            return true;
        }
        return false;
    }

    private function endsWith($haystack, $needle)
    {
        $length = strlen($needle);
        if ($length == 0) {
            return true;
        }

        return (substr($haystack, -$length) === $needle);
    }
}