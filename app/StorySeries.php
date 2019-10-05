<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StorySeries extends Model
{
    //
    protected $table = 'story_series';

    protected $fillable = [
        'story_id',
        'series_id'
    ];

}
