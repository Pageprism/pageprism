<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'content',
        'content_type',
        'user_id',
        'story_id',
        'parent_id'
    ];

    /**
     * Get the user which owns the Comment
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function story()
    {
        return $this->belongsTo(Story::class,'story_id');
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class,'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class,'parent_id');
    }

    public function reactions()
    {
        return $this->hasMany(Reaction::class);
    }
}
