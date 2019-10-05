<?php


namespace App\Services;


use App\Role;
use App\RoleUser;
use App\User;


class RoleHelper
{


//    public function doIt()
//    {
//        \App\PSPublisher::all()->each(function ($p) {
//            $r = $this->getRole('author@pageshare');
//            $rU = $this->getRoleUser($p->user_id, $r->id);
//            if (!empty($p->moderators())) {
//                collect($p->moderators())->each(function ($u) use ($r) {
//                    $this->getRoleUser($u->id, $r->id);
//                });
//            }
//            if (!empty($p->creators())) {
//                collect($p->creators())->each(function ($u) use ($r) {
//                    $this->getRoleUser($u->id, $r->id);
//                });
//            }
//        });
//
//    }

    public function __construct()
    {
    }

    /**
     * This will help to prevent user from giving himself or
     * others a role higher then he/she holds currently!
     *
     * @param User $user
     * @param Role $role
     * @return bool
     */
    public function isUserAllowedToShareRole(User $user, Role $role)
    {
        $tmpUser = new class extends User
        {

            private $role;

            function setRole($role)
            {
                $this->role = $role;
            }

            function hasRole($name)
            {
                return $name === $this->role->name;
            }
        };
        $tmpUser->setRole($role);

        return $this->firstHasHigherRole($user, $tmpUser) || $this->haveEqualHighRoles($user, $tmpUser);
    }

    /**
     * Firs always must hold higher role than the second to be allowed to edit second's role. This
     * helper can tell this situation.
     * @param User $first
     * @param User $second
     * @return bool
     */
    public function firstCanEditSecondsRoles(User $first, User $second)
    {
        return $this->firstHasHigherRole($first, $second) || $this->haveEqualHighRoles($first, $second);
    }

    public function haveEqualHighRoles(User $first, User $second)
    {
        return !($this->firstHasHigherRole($first, $second) || $this->firstHasHigherRole($second, $first));
    }

    public function firstHasHigherRole(User $first, User $second)
    {
        if (empty($first)) {
            return false;
        } else if (empty($second)) {
            return true;
        }
        if ($first->hasRole('super') && !$second->hasRole('super')) {
            return true;
        } else if ($this->isPlatformModeratorOrHigher($first) && !$this->isPlatformModeratorOrHigher($second)) {
            return true;
        }

        return $this->isPSAdminOrHigher($first) && !$this->isPSAdminOrHigher($second);
    }

    public function isPSAdminOrHigher(User $user)
    {
        if (empty($user)) {
            return false;
        }
        return $this->isPlatformModeratorOrHigher($user) || $user->hasRole('admin@pageshare');
    }

    public function canCreatePersonalCollections($user)
    {
        return $this->isPSAdminOrHigher($user) || $user->hasRole('author@pageshare');
    }

    public function isPlatformModeratorOrHigher(User $user)
    {
        if (empty($user)) {
            return false;
        }
        return $user->hasRole('super') || $user->hasRole('moderator');
    }

    /**
     * Convert to the pivot instance which has its own unique id, helps easy
     * interaction between UX type models and this API.
     */
    public function convertUserRoles(User $user)
    {
        $converted = collect([]);
        $roles = $user->roles;
        unset($user->roles);
        if (!empty($roles)) {
            $converted = $roles->map(function ($r) use ($user) {
                $role = $this->getRoleUser($user->id, $r->id);
                $role->name = $r->name;
                return $role;
            });
        }
        return $converted;
    }

    public function getRole($name)
    {

        $role = Role::where('name', strtolower($name))
            ->first();
        if (empty($role)) {
            $role = new Role();
            $role->fill([
                'name' => strtolower($name)
            ]);
            $role->save();
        }
        return $role;
    }

    public function getRoleUser($user_id, $role_id)
    {
        $roleUser = RoleUser::where('user_id', $user_id)
            ->where('role_id', $role_id)
            ->first();
        if (empty($roleUser)) {
            $roleUser = new RoleUser();
            $roleUser->fill([
                'user_id' => $user_id,
                'role_id' => $role_id
            ]);
            $roleUser->save();
        }
        return $roleUser;
    }
}