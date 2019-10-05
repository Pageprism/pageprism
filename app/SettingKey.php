<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SettingKey extends Model
{
    //
    protected $table = 'setting_keys';

    protected $fillable = [
        'name'
    ];
}
