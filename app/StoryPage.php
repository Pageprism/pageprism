<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoryPage extends Model
{

    protected $table = 'story_pages';

    protected $fillable = [
        'file_id',
        'story_id',
        'number',
        'width',
        'resolution',
        'height',
        'is_cover',
    ];

    /**
     * @return BelongsTo
     */
    public function story()
    {
        return $this->belongsTo(Story::class, 'story_id');
    }

    /**
     * @return BelongsTo
     */
    public function file()
    {
        return $this->belongsTo(File::class, 'file_id');
    }
}
