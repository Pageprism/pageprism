<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class Track extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'content', 'user_id', 'target_type', 'target_id',
        'from_link', 'to_link', 'link', 'ip', 'agent',
        'session_id', 'device_session_id', 'server_session_id', 'token_id',
        'min', 'max', 'count', 'duration','updated_at'
    ];

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

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function token()
    {
        return $this->belongsTo(ApiToken::class, 'token_id');
    }


}
