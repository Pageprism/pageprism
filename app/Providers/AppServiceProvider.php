<?php

namespace App\Providers;

use App\Services\AppFilesManager;
use App\Services\BasicPreviewConfig;
use App\Services\ExternalPreviewConfigBuilder;
use App\Services\PSDocBodyDecorator;
use App\Services\PSDocConverter;
use App\Services\PSDocHelper;
use App\Services\PSEmailManager;
use App\Services\PSRoleHelper;
use App\Services\RoleHelper;
use App\Services\AutoCompleteManager;
use App\Services\StorySearchManager;
use Illuminate\Support\ServiceProvider;
use App\Services\AccessTokenIdResolver;
use App\Services\EmailNotifManager;
use App\Services\InAppNotifManager;
use App\Contracts\NotifManager;
use App\Services\NotifManagerImpl;
use App\Services\SocketClientResolver;
use App\Services\NotifBodyDecorator;
use App\Services\AwrCTRHelper;
use App\Services\PdfToImgConverter;
use App\Services\PSDocService;
use App\Services\CanUser;
use App\Entities\AppEnvironment;
use App\Services\AwrAppManager;

class AppServiceProvider extends ServiceProvider
{
    /**
     * All of the container singletons that should be registered.
     *
     * @var array
     */
    public $singletons = [
        AccessTokenIdResolver::class,
        EmailNotifManager::class,
        PSEmailManager::class,
        InAppNotifManager::class,
        NotifManagerImpl::class,
        SocketClientResolver::class,
        NotifBodyDecorator::class,
        AwrCTRHelper::class,
        PdfToImgConverter::class,
        PSDocService::class,
        PSDocBodyDecorator::class,
        AppFilesManager::class,
        PSRoleHelper::class,
        RoleHelper::class,
        AutoCompleteManager::class,
        StorySearchManager::class,
        CanUser::class,
        BasicPreviewConfig::class,
        ExternalPreviewConfigBuilder::class,
        AppEnvironment::class,
        AwrAppManager::class,
        PSDocHelper::class,
        PSDocConverter::class
    ];

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //binding interfaces with implementations
        $this->app->bind('App\Contracts\NotifManager', 'App\Services\NotifManagerImpl');

    }
}
