<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Collection;
class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'phone'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function hasRole($name)
    {
        $roles = $this->roles;
        foreach ($roles as $r) {
            if ($r->name === $name) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return mixed
     */
    public function profileStory()
    {
        return Story::where('user_id', $this->id)->where('type', 'profile_story')->first();
    }

    /**
     * @return Collection
     */
    public function profileReviews()
    {
        $story = $this->profileStory();
        if (!empty($story)) {
            return $story->comments;
        }
        return collect(array());
    }

    /**
     * @return Collection
     */
    public function profileReactions()
    {
        $story = $this->profileStory();
        if (!empty($story)) {
            return $story->reactions;
        }
        return collect(array());
    }


    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_users');
    }


    public function socialLinks()
    {
        return $this->hasMany(SocialLink::class, 'user_id');
    }

    public function experiences()
    {
        return $this->hasMany(Experience::class, 'user_id');
    }

    public function skills()
    {
        return $this->hasMany(Skill::class, 'user_id');
    }

    public function ownPublishers()
    {
        return $this->hasMany(PSPublisher::class, 'user_id');
    }

    public function collections()
    {
        return $this->hasMany(Series::class, 'user_id');
    }

    public function stories()
    {
        return $this->hasMany(Story::class, 'user_id');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'followings', 'followed_id', 'follower_id');
    }

    public function follows()
    {
        return $this->belongsToMany(User::class, 'followings', 'follower_id', 'followed_id');
    }

    public function contact_replies()
    {
        return $this->hasMany(Reply::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function setupMainSeries()
    {
        $this->main_series = MainSeries::where('user_id', $this->id)->get();
    }
}
































