<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Notification;

class ContactMessage extends Model
{
    /**
     * For allowing mass assignment you need $fillable
     */
    protected $fillable = [
        'subject',
        'content',
        'requester_id',
        'newsletter_topic',
        'type'];

    public function requester()
    {
        return $this->belongsTo(Requester::class,'requester_id');
    }
    public function replies()
    {
        return $this->hasMany(Reply::class,'message_id');
    }

    public function notifications()
    {
        return Notification::where('type', 'contact_messages')
            ->where('item_id', $this->id)->get();
    }
}
