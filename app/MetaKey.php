<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MetaKey extends Model
{
    //
    protected $table = 'meta_keys';

    protected $fillable = [
        'name'
    ];
}
