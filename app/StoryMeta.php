<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StoryMeta extends Model
{
    protected $table = 'story_meta_values';

    protected $fillable = [
        'meta_value_id',
        'story_id'
    ];



    public function metaValue()
    {
        return $this->belongsTo(MetaValue::class, 'meta_value_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function story()
    {
        return $this->belongsTo(Story::class, 'story_id');
    }
}
