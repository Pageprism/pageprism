<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TagSubscription extends Model
{
    //type: blacklist, whitelist
    protected $fillable = [
        'user_id', 'tag_id','type'
    ];

    protected $table = 'tag_subscriptions';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }


}
