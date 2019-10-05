<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class Notification extends Model
{
    //

    protected $table = 'notifications';

    protected $fillable = [
        'name',
        'seen',
        'action_type',
        'action_id',
        'target_type',
        'target_id',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model | null
     */
    public function target()
    {
        if (!empty($this->target_type) && Schema::hasTable($this->target_type)) {
            return DB::table($this->target_type)
                ->where('id', $this->target_id)->first();
        }
        return null;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model | null
     */
    public function action()
    {
        if (!empty($this->action_type) && Schema::hasTable($this->action_type)) {
            return DB::table($this->action_type)
                ->where('id', $this->action_id)->first();
        }
        return null;
    }
}
