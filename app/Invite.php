<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class invite extends Model
{
    //
    protected $fillable = [
        'inviter_id', 'invitee_id', 'name',
        'email', 'invite_text', 'role_name',
        'status'
    ];

    protected $table = 'invites';

    public function inviter()
    {
        return $this->belongsTo(User::class,'inviter_id');
    }

    public function invitee()
    {
        return $this->belongsTo(User::class,'invitee_id');
    }
}
