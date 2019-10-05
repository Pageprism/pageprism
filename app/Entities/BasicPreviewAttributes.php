<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 28.8.2018
 * Time: 13:39
 */

namespace App\Entities;

use ReflectionClass;
use ReflectionException;
use ReflectionProperty;

class BasicPreviewAttributes
{

    public $server_root;

    public $appGroup;

    public $description;

    public $previewImage;

    public $defPreviewSrc;

    public $title;

    public $data;

    public $ux_resources = 'read_app';

    public $layout_group = 'awr';

    public function __construct(Array $setting)
    {
        try {
            $refl = new ReflectionClass($this);
        } catch (ReflectionException $e) {
            $refl = null;
        }
        if (!empty($refl)) {
            foreach ($setting as $p => $v) {
                $property = $refl->getProperty($p);
                if ($property instanceof ReflectionProperty) {
                    $property->setValue($this, $v);
                }
            }
        }

    }
}