<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BusyStory extends Model
{
    protected $table = 'busy_stories';

    protected $fillable = [
        'story_id',
        'job_id'
    ];

    public function story()
    {
        return $this->belongsTo(Story::class,'story_id');
    }

}
