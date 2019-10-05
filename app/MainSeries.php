<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MainSeries extends Model
{
    /*This model can be used for creating favourite set or main collections*/
    protected $fillable = [
        'user_id',
        'series_id',
        'type'
    ];

    protected $table = 'main_series';

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function series()
    {
        return $this->belongsTo(Series::class,'series_id');
    }
}
