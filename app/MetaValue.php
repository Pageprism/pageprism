<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MetaValue extends Model
{
    //
    protected $table = 'meta_values';

    protected $fillable = [
        'meta_key_id',
        'value'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function metaKey()
    {
        return $this->belongsTo(MetaKey::class, 'meta_key_id');
    }
}
