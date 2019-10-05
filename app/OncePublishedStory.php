<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OncePublishedStory extends Model
{
    //
    protected $table = 'once_published_stories';

    protected $fillable = [
        'story_id'
    ];

    public function story()
    {
        return $this->belongsTo(Story::class,'story_id');
    }

}
