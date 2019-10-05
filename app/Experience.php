<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    //
    protected $fillable = [
        'user_id',
        'type',
        'position',
        'at',
        'description',
        'started',
        'ended',
        'is_current'
    ];

    /**
     * Get the user which owns the Experience
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
