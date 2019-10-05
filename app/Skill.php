<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;

class Skill extends Model
{
    //
    protected $fillable = [
        'user_id', 'tag_id'
    ];

    protected $table = 'skills';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
