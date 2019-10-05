<?php


namespace App\Services;


use App\PSPublisher;
use App\PSPublisherRole;
use App\PSPublisherRoleUser;
use App\User;


class PSRoleHelper
{



    /**
     * @param $user_id
     * @param $role_id
     * @return PSPublisherRoleUser
     */
    public function getRoleUser($user_id, $role_id)
    {
        $roleUser = PSPublisherRoleUser::where('user_id', $user_id)
            ->where('role_id', $role_id)
            ->first();
        if (empty($roleUser)) {
            $roleUser = new PSPublisherRoleUser();
            $roleUser->fill([
                'user_id' => $user_id,
                'role_id' => $role_id
            ]);
            $roleUser->save();
        }
        return $roleUser;
    }

    /**
     * @param $name
     * @param $publisher_id
     * @return PSPublisherRole
     */
    public function getRole($name, $publisher_id)
    {
        $role = PSPublisherRole::where('publisher_id', $publisher_id)
            ->where('name', strtolower($name))
            ->first();
        if (empty($role)) {
            $role = new PSPublisherRole();
            $role->fill([
                'name' => strtolower($name),
                'publisher_id' => $publisher_id

            ]);
            $role->save();
        }
        return $role;
    }

    public function areCoworkers(User $a, User $b)
    {
        if (empty($a) || empty($b)) {
            return false;
        }

        return PSPublisher::all()->filter(function ($p) use ($a, $b) {
                return $this->userInPublisher($a, $p) && $this->userInPublisher($b, $p);
            })->count() > 0;

    }

    public function userInPublisher(User $user, PSPublisher $publisher)
    {
        if (empty($user) || empty($publisher)) {
            return false;
        }
        return $user->id === $publisher->user_id ||
            $this->userHasCreatorPrivileges($user, $publisher) ||
            $this->userHasModeratorPrivileges($user, $publisher);
    }

    /**
     * @param $publisher {\App\PSPublisher}
     * @param $user {\App\User}
     * @return bool
     */
    public function userHasModeratorPrivileges(User $user, PSPublisher $publisher)
    {
        if (empty($user) || empty($publisher)) {
            return false;
        }
        if ($user->hasRole('admin@pageshare') || $user->id === $publisher->user_id) {
            return true;
        }
        return $publisher->hasModerator($user->id);
    }

    /**
     * @param $publisher {\App\PSPublisher}
     * @param $user {\App\User}
     * @return bool
     */
    public function userHasCreatorPrivileges(User $user, PSPublisher $publisher)
    {
        if (empty($user) || empty($publisher)) {
            return false;
        }

        if ($user->hasRole('admin@pageshare') || $user->id === $publisher->user_id) {
            return true;
        }

        return $publisher->hasModerator($user->id) || $publisher->hasCreator($user->id);
    }
}