<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 28.8.2018
 * Time: 13:39
 */

namespace App\Entities;

use Illuminate\Support\Facades\Log;
use ReflectionClass;
use ReflectionException;
use ReflectionProperty;
use Exception;
use App\Traits\CTRUtils;

class AppEnvironment
{

    use CTRUtils;

    public $product_group_id = null;

    public $app_root = "public";

    public $apps = [];


    public function __construct()
    {
        $groupId = env('PRODUCT_GROUP_ID', 'awr');
        $cnf_path = config_path() . "/products/$groupId.json";
        try {
            $settings = (array)json_decode(file_get_contents($cnf_path));
        } catch (Exception $e) {
            $settings = [];
        }
        try {
            $refl = new ReflectionClass($this);
        } catch (ReflectionException $e) {
            $refl = null;
        }
        if (!empty($refl)) {
            foreach ($settings as $p => $v) {
                $property = $refl->getProperty($p);
                if ($property instanceof ReflectionProperty) {
                    $property->setValue($this, $v);
                }
            }
        }
        $this->setData();
    }

    public function hasApp($appCode)
    {
        return collect($this->apps)->contains('code', $appCode);
    }

    public function getApp($appCode)
    {
        return collect($this->apps)->filter(function ($app) use ($appCode) {
            return $app->code == $appCode;
        })->first();
    }

    private function setData()
    {
        $server_root = static::getServerRoot();
        foreach ($this->apps as $app) {
            if ($app->name == 'awr_home') {
                $app->data = [
                    'share_links' => [
                        'team-view' => $server_root . '/share/' . CTRUtils::encodeItemShareId('team', 'h'),
                        'about-view' => $server_root . '/share/' . CTRUtils::encodeItemShareId('about', 'h'),
                        'join-view' => $server_root . '/share/' . CTRUtils::encodeItemShareId('join', 'h'),
                        'contact-view' => $server_root . '/share/' . CTRUtils::encodeItemShareId('contact', 'h'),
                    ]
                ];

            } else {
                $app->data = null;
            }
        }
    }
}


