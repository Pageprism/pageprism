<?php

namespace App\Traits;

use Illuminate\Support\ServiceProvider;
use App\Traits\CTRUtils;
use App\User;
use App\Exchange;


trait UserCredentialExchange
{


    static function isEmailConfirmed($user)
    {
        return !empty($user) && Exchange::where('key', 'LIKE', $user->id . '_%')
                ->where('type', 'confirm_email')
                ->where('value', $user->email)
                ->where('used', 1)->count() > 0;
    }

    static function confirmUserEmail($key)
    {

        $decoded = static::decodeItemShareId($key);
        $exchange = Exchange::where('key', $decoded->id)->where('type', 'confirm_email')->first();
        $notFound = false;
        $confirmUser = User::find($decoded->prefix);
        if (empty($exchange) || empty($confirmUser)) {
            $message = 'This email confirmation link is expired or does not exist!';
            $notFound = true;
        } else if ($exchange->used) {
            $message = 'Your emails has been already confirmed!';
        } else {
            $message = 'Your email successfully confirmed!';
            $exchange->used = true;
            $exchange->save();
            $old_keys = Exchange::where('type', 'confirm_email')
                ->where('key', 'LIKE', $confirmUser->id . '_%')
                ->whereNotIn('id', [$exchange->id])
                ->get()->map(function ($m) {
                    return $m->id;
                });
            /*
             * Removing other confirmations for user. If user
             * change its email the new email require a new confirmation
             * but also the old email should loose its confirmed status,
             * in this way if later user changes its mind and decide to
             * take the old email address back in use the new
             * confirmation should be required.
             * */
            if (!empty($old_keys) && count($old_keys) > 0) {

                Exchange::destroy($old_keys);
            }
        }

        return [
            'message' => $message,
            'notFound' => $notFound
        ];
    }

    static function passwordResetKeyOk($key)
    {
        $decoded = static::decodeItemShareId($key);
        $found = Exchange::where('key', $decoded->id)->where('type', 'password_reset')->where('used', 0)->count();
        return $found > 0;
    }

    static function handlePasswordResetKey($key)
    {
        $decoded = static::decodeItemShareId($key);
        $exchange = Exchange::where('key', $decoded->id)->where('type', 'password_reset')->where('used', 0)->first();
        $passUser = User::find($decoded->prefix);
        if (empty($exchange) || empty($passUser) || $exchange->used) {
            return false;
        }
        $exchange->used = true;
        $exchange->save();
        /**
         * Invalidating also other password reset links for the user
         */
        Exchange::where('type', 'password_reset')
            ->where('key', 'LIKE', $passUser->id . '_%')
            ->get()->each(function ($m) {
                $m->used = true;
                $m->save();
            });
        return true;
    }

    static function cancelPasswordResetKey($key)
    {
        $decoded = static::decodeItemShareId($key);
        $exchange = Exchange::where('key', $decoded->id)->where('type', 'password_reset')->first();
        if (empty($exchange)) {
            return false;
        }
        $exchange->used = true;
        $exchange->save();
        return true;
    }

    static function getPasswordResetUser($key)
    {
        $decoded = static::decodeItemShareId($key);
        $passUser = User::find($decoded->prefix);
        return $passUser;
    }
}
