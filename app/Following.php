<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Following extends Model
{
    //
    protected $fillable = [
        'follower_id',
        'followed_id'
    ];

    protected $table = 'followings';

    public function follower()
    {
        return $this->belongsTo(User::class,'follower_id');
    }

    public function followed()
    {
        return $this->belongsTo(User::class,'followed_id');
    }

}
