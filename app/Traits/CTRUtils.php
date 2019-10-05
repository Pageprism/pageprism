<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Exception;
use Illuminate\Support\Facades\Log;
use ReflectionClass;
use ReflectionException;
use ReflectionProperty;
//use Log;

trait CTRUtils
{
    public function storyEditableByUser($user, $story)
    {

        // Recommended version, using strpos
        if (empty($user) || empty($story)) {
            return false;
        }
        $isAdmin = $user->roles->filter(function ($value, $key) {
                return $value === "moderator";
            })->count() > 0;
        return $isAdmin || $story->user_id === $user['id'];
    }

    public function isUserAdmin($user)
    {
        // Recommended version, using strpos
        if (empty($user)) {
            return false;
        }
        return $user->roles->filter(function ($value, $key) {
                return $value->name === "moderator";
            })->count() > 0;
    }

    public function storyHasTag($story, $tag)
    {
        if (empty($story)) {
            return false;
        }
        return $story->tags->filter(function ($value, $key) use ($tag) {
                return $value->name === $tag->name;
            })->count() > 0;
    }

    public function startsWith($haystack, $needle)
    {
        if (empty($haystack) || empty($needle)) {
            return false;
        }
        // Recommended version, using strpos
        return strpos($haystack, $needle) === 0;
    }

    static function getServerRoot(): string
    {
        if (isset($_SERVER) && isset($_SERVER['HTTP_HOST'])) {
            return (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        }
        return '';
    }

    /**
     * @param $id
     * @param $prefix
     * @return string
     */
    static function encodeItemShareId($id, $prefix = null)
    {
        return empty($prefix) ? static::base64URLEncode($id) : static::base64URLEncode($prefix . ':' . $id);
    }

    /**
     * @param $string
     * @return string
     */
    static function urlSafeTitleEncode($string)
    {
        $str = str_replace(' ', '_', $string);
        return urlencode(strtolower($str));
    }

    static function getPropertyValue(Model $context, $key, $default)
    {
        try {
            $context = $context->toArray();
        } catch (\Exception $e) {
            $context = null;
        }
        if (empty($context)) {
            return $default;
        }
        $v = isset($context[$key]) ? $context[$key] : $default;
        return !empty($v) ? $v : $default;
    }

    /**
     * @param $encoded
     * @return object
     */
    static function decodeItemShareId($encoded)
    {
        $dec = static::base64URLDecode($encoded);
        $parts = !empty($dec) && strlen($dec) > 0 ? explode(':', $dec) : [];
        $id = $dec;
        $prefix = '';
        if (count($parts) > 1) {
            $id = $parts[1];
            $prefix = $parts[0];
        }
        return (object)[
            'id' => $id,
            'prefix' => $prefix
        ];
    }

    //base64 url friendly encodes and decodes taken form: http://php.net/manual/en/function.base64-encode.php

    /**
     * @param $data
     * @return string
     */
    static function base64URLEncode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * @param $data
     * @return bool|string
     */
    static function base64URLDecode($data)
    {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }

    static function buildUXAppConfig($appName, $title, $appGroup = null,
                                     $meta_tags = array(), $data = [], $indexCnf = null)
    {
        if (is_null($indexCnf)) {
            $indexCnf = (object)[];
        }
        $path = base_path() . "/public/${appName}/product.json";
        try {
            $cnf = json_decode(file_get_contents($path), true);
            $app_v_tag = !is_null($cnf) && !empty($cnf['v-tag']) && $cnf['v-tag'] !== 'unspecified' ?
                '-' . $cnf['v-tag'] : '';
            $data = (object)$data;
        } catch (Exception $e) {
            $cnf = null;
            $app_v_tag = '';
        }

        $app_version = !is_null($cnf) ? $cnf['version'] . $app_v_tag : '';
        $icon_version = !is_null($cnf) ? $app_version : '22';
        try {
            $cnfIcon = isset($indexCnf->icon) ? (object)$indexCnf->icon : new \stdClass();
        } catch (Exception $e) {
            $cnfIcon = new \stdClass();
        }
        $icon = (object)[
            'rel' => 'shortcut icon',
            'type' => isset($cnfIcon->type) ?
                $cnfIcon->type : 'image/png',
            'href' => isset($cnfIcon->href) ?
                $cnfIcon->href . '?v=' . $icon_version : '/assets/' . $appName . '/icon.png?v=' . $icon_version
        ];

        $app = (object)[
            'title' => $title,
            'name' => $appName,
            'app_version' => $app_version,
            'ux_version' => !is_null($cnf) ? $cnf['ux-version'] : '',
            'icon' => $icon,
            'app_group' => !empty($appGroup) ? $appGroup : 'default',
            'meta_tags' => $meta_tags,
            'data' => $data,
            'layout_group' => !empty($indexCnf->layout_group) ? $indexCnf->layout_group : 'awr'
        ];

        return compact('app');
    }

    static function getAppIndexConfig($app_name = null)
    {
        $conf = (object)[];
        $path = public_path() . '/' . $app_name . '/index.json';
        if (empty($app_name) || !file_exists($path)) {
            return $conf;
        }
        try {
            $conf = json_decode(file_get_contents($path), true);

            if (is_array($conf['meta'])) {
                $conf['meta'] = collect($conf['meta'])
                    ->filter(function ($m) {
                        return !isset($m['name']) || !($m['name'] === 'dev-csrf-token' || $m['name'] === 'csrf-token');
                    })
                    ->toArray();
            }
        } catch (Exception $e) {
            $conf = (object)[];
        }
        return (object)$conf;
    }

}