<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PSPublisherRole extends Model
{

    protected $fillable = [
        'publisher_id', 'name',
    ];

    protected $table = 'ps_publisher_roles';

    public function publisher()
    {
        return $this->belongsTo(PSPublisher::class);
    }
}
