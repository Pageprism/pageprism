<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class Reaction extends Model
{

    protected $table = 'reactions';
    /**
     * The attributes that are mass assignable.
     *
     * @note In addition to stories and comments other models
     * also are supported through target_type and target_id!
     *
     * @var array
     */
    protected $fillable = ['story_id', 'comment_id', 'user_id', 'reaction_type_id', 'target_type', 'target_id'];

    /**
     * Get the user that owns the owns
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function story()
    {
        return $this->belongsTo(Story::class, 'story_id');
    }

    public function comment()
    {
        return $this->belongsTo(Comment::class, 'comment_id');
    }

    public function type()
    {
        return $this->belongsTo(ReactionType::class, 'reaction_type_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model | null
     */
    public function target()
    {
        if (!empty($this->target_type) && Schema::hasTable($this->target_type)) {
            return DB::table($this->target_type)
                ->where('id', $this->target_id)->first();
        }
        return null;
    }

}
