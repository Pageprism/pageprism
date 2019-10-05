<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StorySetting extends Model
{
    protected $table = 'story_setting_values';

    protected $fillable = [
        'setting_value_id',
        'story_id'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function settingValue()
    {
        return $this->belongsTo(SettingValue::class, 'setting_value_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function story()
    {
        return $this->belongsTo(Story::class, 'story_id');
    }
}
