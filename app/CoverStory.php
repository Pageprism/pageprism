<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CoverStory extends Model
{
    //
    protected $fillable = [
        'story_id',
        'title',
        'key',
        'starting',
        'ending'
    ];

    public function scopeActive($query){
        return $query
            ->where('starting','<=',date('Y-m-d'))
            ->where('ending','>=',date('Y-m-d'));
    }

    public function scopeNextActives($query){
        return $query
            ->where('starting','>',date('Y-m-d'));
    }

    public function scopePastActives($query){
        return $query
            ->where('ending','<',date('Y-m-d'));
    }

    public function story()
    {
        return $this->belongsTo(Story::class,'story_id');
    }
}
