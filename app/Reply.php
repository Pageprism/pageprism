<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Reply extends Model
{
    /**
     * For allowing mass assignment you need $fillable
     */
    protected $fillable = [
        'user_id',
        'message_id',
        'subject',
        'content',
        'is_auto_reply',
        'status',
        'sent_time'];

    public function replier()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function contact_message()
    {
        return $this->belongsTo(ContactMessage::class,'message_id');
    }
}
