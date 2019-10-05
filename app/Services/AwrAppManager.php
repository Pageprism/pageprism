<?php

namespace App\Services;


use App\Entities\AppEnvironment;
use App\Traits\CTRUtils;
use Illuminate\Support\Facades\Hash;
use Log;

class AwrAppManager
{

    use CTRUtils;

    /**
     * @var AppEnvironment
     */
    protected $appEnv;

    /**
     * AwrAppManager constructor.
     * @param AppEnvironment $appEnv
     */
    public function __construct(AppEnvironment $appEnv)
    {
        $this->appEnv = $appEnv;

    }

    /**
     * @param $appCode
     * @return object
     */
    public function makeApp($appCode)
    {
        $setup = $this->appEnv->getApp($appCode);
        $appGroup = Hash::make(env($setup->group, 'default'));
        $indexCnf = CTRUtils::getAppIndexConfig($setup->name);
        $appConfig = CTRUtils::buildUXAppConfig($setup->name, $indexCnf->title,
            $appGroup, $indexCnf->meta, $setup->data, $indexCnf);
        /**
         * The layout_group property can be defined by
         * other properties files like .env and index.json,
         * here we should make sure that the appEnv value
         * is always preferred.
         */
        if(!empty($setup->layout_group)){
            $appConfig['app']->layout_group = $setup->layout_group;
        }
        return (object)[
            'type' => $setup->type,
            'config' => $appConfig
        ];
    }


}