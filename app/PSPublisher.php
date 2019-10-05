<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PSPublisher extends Model
{
    //

    protected $fillable = [
        'user_id', 'name', 'description'
    ];

    protected $table = 'ps_publishers';

    /*owner account*/
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function collections()
    {
        return $this->hasMany(Series::class, 'publisher_id');
    }

    public function hasModerator($user_id)
    {

        return $this->moderators()
                ->filter(function ($m) use ($user_id) {
                    return $m->id === $user_id;
                })->count() > 0;
    }

    public function hasCreator($user_id)
    {

        return $this->creators()
                ->filter(function ($m) use ($user_id) {
                    return $m->id === $user_id;
                })->count() > 0;
    }

    public function moderators()
    {

        $role = PSPublisherRole::where('publisher_id', $this->id)
            ->where('name', 'moderator')
            ->first();
        if (empty($role)) {
            return collect(array());
        }
        return PSPublisherRoleUser::where('role_id', $role->id)->get()->map(function ($ru) {
            $user = User::find($ru->user_id);
            $user->role_id = $ru->id;
            $user->role_name = $ru->role->name;
            return $user;
        })->flatten();
    }

    public function creators()
    {

        $role = PSPublisherRole::where('publisher_id', $this->id)
            ->where('name', 'creator')
            ->first();
        if (empty($role)) {
            return collect(array());
        }
        return PSPublisherRoleUser::where('role_id', $role->id)->get()->map(function ($ru) {
            $user = User::find($ru->user_id);
            $user->role_id = $ru->id;
            $user->role_name = $ru->role->name;
            return $user;
        })->flatten();
    }

    public function addModerator($user_id)
    {
        return $this->addRole($user_id, 'moderator');
    }

    public function addCreator($user_id)
    {
        return $this->addRole($user_id, 'creator');
    }

    private function addRole($user_id, $roleName)
    {
        $user = User::find($user_id);
        if (empty($user)) {
            return false;
        }
        $role = PSPublisherRole::where('publisher_id', $this->id)->where('name', $roleName)->first();
        if (empty($role)) {
            $role = new PSPublisherRole();
            $role->fill([
                'publisher_id' => $this->id,
                'name' => $roleName
            ]);
            $role->save();
        }
        $ru = PSPublisherRoleUser::where('user_id', $user->id)->where('role_id', $role->id)->first();
        if (!empty($ru)) {
            return;
        }
        $ru = new PSPublisherRoleUser();
        $ru->fill([
            'user_id' => $user->id,
            'role_id' => $role->id
        ]);
        $ru->save();
        return true;
    }
}
