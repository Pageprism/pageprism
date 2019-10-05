<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;

class Tag extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name'
    ];

    public function stories()
    {
        return $this->belongsToMany(Story::class,'story_tag','tag_id','story_id');
    }
}
