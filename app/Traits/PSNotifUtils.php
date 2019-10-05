<?php

namespace App\Traits;

use App\User;
use App\TagSubscription;


trait PSNotifUtils
{
    /**
     * @param $tags
     * @return \Illuminate\Support\Collection<App\User>
     */
    static function getSubscribers($tags)
    {
        if (empty($tags)) {
            return collect([]);
        }
        return $tags
            ->map(function ($t) {
                return TagSubscription::where('tag_id', $t->id)
                    ->where('type', 'whitelist')
                    ->get()
                    ->map(function ($ts) {
                        return $ts->user;
                    });
            })
            ->flatten()
            ->filter(function ($u) use ($tags) {
                return !static::containsBlackListedTag($u, $tags);
            })
            ->unique('id');
    }

    /**
     * Find out if user has blacklisted at least
     * one of the tags in $tags
     * @param User $user
     * @param $tags
     * @return bool
     */
    static function containsBlackListedTag(User $user, $tags)
    {
        return TagSubscription::where('user_id', $user->id)
                ->where('type', 'blacklist')
                ->get()
                ->map(function ($bts) {
                    return $bts->tag;
                })
                ->filter(function ($t) use ($tags) {
                    return $tags->contains('id', $t->id);
                })
                ->count() > 0;
    }

}