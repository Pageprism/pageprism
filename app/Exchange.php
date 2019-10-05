<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Exchange extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'key',
        'value',
        'used',
        'type',
        'expires'
    ];

    public function scopeValidKey($query)
    {
        $query->where('used', 0)
            ->where(function ($query) {
                $query->whereDate('expires', '>=', date('Y-m-d H:i:s'))
                    ->orWhereNull('expires');
            });
    }
    public function scopeExpiredKey($query)
    {
        $query->where('used', 1)
            ->orWhere(function ($query) {
                $query->whereDate('expires', '<', date('Y-m-d H:i:s'));
            });
    }

    public function isValid(){
        return $this->used === 0 && (empty($this->expires) || strtotime($this->expires) >= time());
    }

}
