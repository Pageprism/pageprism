<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Series extends Model
{

    protected $table = 'series';

    protected $fillable = [
        'user_id',
        'story_id',
        'publisher_id',
        'name',
        'type',
        'description',
        'status',
    ];



    public function stories()
    {
        return $this->belongsToMany(Story::class, 'story_series',
            'series_id', 'story_id');
    }

    public function publisher()
    {
        return $this->belongsTo(PSPublisher::class, 'publisher_id');
    }


}
