<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PSPublisherRoleUser extends Model
{
    //
    protected $fillable = [
        'role_id', 'user_id',
    ];

    protected $table = 'ps_publisher_role_users';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function role()
    {
        return $this->belongsTo(PSPublisherRole::class);
    }
}
