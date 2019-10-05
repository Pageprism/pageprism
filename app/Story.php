<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Story extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'type', 'content_type', 'title', 'summary', 'snippet', 'content', 'status'
    ];

    protected $columns = array('id', 'user_id', 'type', 'content_type', 'status',
        'title', 'content', 'summary', 'snippet', 'created_at', 'updated_at'); // add all columns from your table

    public function scopeExclude($query, $value = array())
    {
        return $query->select(array_diff($this->columns, (array)$value));
    }

    /**
     * Get the user that owns the story
     * @return BelongsTo
     */
    public function user()
    {

        return $this->belongsTo(User::class, 'user_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'story_tag', 'story_id', 'tag_id');
    }

    public function tracks()
    {
        return $this->hasMany(Track::class, 'target_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function reactions()
    {
        return $this->hasMany(Reaction::class);
    }

    public function storyPages()
    {
        return $this->hasMany(StoryPage::class, 'story_id');
    }

    public function attachments()
    {
        return $this->belongsToMany(File::class, 'story_attachments', 'story_id', 'file_id');
    }

    public function meta()
    {
        return $this->belongsToMany(MetaValue::class, 'story_meta_values', 'story_id', 'meta_value_id');
    }

    public function settings()
    {
        return $this->belongsToMany(SettingValue::class, 'story_setting_values', 'story_id', 'setting_value_id');
    }

    public function series()
    {
        return $this->belongsToMany(Series::class, 'story_series',
            'story_id', 'series_id');
    }

}
