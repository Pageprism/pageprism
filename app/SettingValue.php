<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SettingValue extends Model
{
    //
    protected $table = 'setting_values';

    protected $fillable = [
        'setting_key_id',
        'value'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function settingKey()
    {
        return $this->belongsTo(SettingKey::class, 'setting_key_id');
    }
}
