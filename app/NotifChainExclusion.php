<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class NotifChainExclusion extends Model
{

    protected $table = 'notif_chain_exclusions';

    protected $fillable = [
        'name',
        'target_type',
        'target_id',
        'user_id',
    ];

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
}
