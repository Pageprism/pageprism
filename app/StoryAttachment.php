<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StoryAttachment extends Model
{
    //
    protected $table = 'story_attachments';

    protected $fillable = [
        'file_id',
        'story_id'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function story()
    {
        return $this->belongsTo(Story::class, 'story_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function file()
    {
        return $this->belongsTo(File::class, 'file_id');
    }

}
