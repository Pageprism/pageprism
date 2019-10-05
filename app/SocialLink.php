<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    //
    protected $fillable = [
        'user_id',
        'name',
        'url'
    ];

    protected $table = 'social_links';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}