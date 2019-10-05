<?php


namespace App\Services;


use App\PSPublisher;
use App\Story;
use App\User;
use App\Series;


class CanUser
{
    /**
     * @var RoleHelper
     */
    protected $roleHelper;

    /**
     * @var PSRoleHelper
     */
    protected $psRoleHelper;

    public function __construct(RoleHelper $roleHelper, PSRoleHelper $psRoleHelper)
    {
        $this->roleHelper = $roleHelper;
        $this->psRoleHelper = $psRoleHelper;
    }

    public function removeUserAccount(User $user, User $account)
    {
        if (empty($user) || empty($account)) {
            return false;
        }
        /*super user should not be removed*/
        if ($account->hasRole('super')) {
            return false;
        }
        if ($user->id === $account->id) {
            return true;
        }
        return $this->roleHelper->isPSAdminOrHigher($user) &&
            ($this->roleHelper->firstHasHigherRole($user, $account) ||
                $this->roleHelper->haveEqualHighRoles($user, $account));
    }

    public function createPublisher(User $user)
    {

        return $this->roleHelper->isPSAdminOrHigher($user);
    }

    public function updatePublisher(User $user, PSPublisher $publisher)
    {
        if (empty($user) || empty($publisher)) {
            return false;
        }
        return $this->roleHelper->isPSAdminOrHigher($user) ||
            $this->psRoleHelper->userHasModeratorPrivileges($user, $publisher);
    }

    public function removePublisher(User $user, PSPublisher $publisher)
    {
        if (empty($user) || empty($publisher)) {
            return false;
        }
        $owner = $publisher->user;
        return $this->roleHelper->isPSAdminOrHigher($user) && (
            ($this->roleHelper->firstHasHigherRole($user, $owner) ||
                $this->roleHelper->haveEqualHighRoles($user, $owner)));
    }

    public function editPSCollectionsForPublisher(User $user, $publisher)
    {
        return $this->createPSCollectionsForPublisher($user, $publisher);
    }

    public function createPSCollectionsForPublisher(User $user, $publisher)
    {
        if (empty($publisher) || empty($user)) {
            return false;
        }
        return $this->psRoleHelper->userHasModeratorPrivileges($user, $publisher);
    }

    public function editPersonalCollections(User $user)
    {
        return $this->createPersonalCollections($user);

    }

    public function createPersonalCollections(User $user)
    {
        return $this->roleHelper->canCreatePersonalCollections($user);
    }

    public function createPSDocsInCollection(User $user, Series $coll)
    {
        if (empty($coll) || empty($user)) {
            return false;
        }
        if ($coll->user_id == $user->id) {
            return true;
        }
        return !empty($coll->publisher) ?
            $this->psRoleHelper->userHasCreatorPrivileges($user, $coll->publisher) : false;
    }

    public function editPSDoc(User $user, Story $doc)
    {

        if (empty($doc) || empty($user)) {
            return false;
        }
        if ($this->roleHelper->isPSAdminOrHigher($user)) {
            return true;
        }
        if ($doc->user_id == $user->id) {
            return true;
        }
        if (empty($doc->series)) {
            return false;
        }
        return $doc->series
                ->filter(function ($c) use ($user) {
                    return !empty($c->publisher) ?
                        $this->psRoleHelper->userHasModeratorPrivileges($user, $c->publisher) : false;
                })->count() > 0;
    }

}