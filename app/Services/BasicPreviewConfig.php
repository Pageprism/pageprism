<?php

namespace App\Services;


use App\Entities\BasicPreviewAttributes;
use App\Traits\CTRUtils;

class BasicPreviewConfig
{

    use CTRUtils;

    public function __construct()
    {
    }


    public function make(BasicPreviewAttributes $attrs): array
    {

//        $server_root,$appGroup, $description, $previewImage, $defPreviewSrc, $title, $data;

        //for pathname use $_SERVER[REQUEST_URI]
        $imgSrc = is_array($attrs->previewImage) && isset($attrs->previewImage['src']) ?
            $attrs->server_root . $attrs->previewImage['src'] : $attrs->server_root . $attrs->defPreviewSrc;

        $meta_tags = array();

        $meta_tags[] = (object)[
            'name' => 'description',
            'content' => $attrs->description
        ];
        $meta_tags[] = (object)[
            'property' => 'og:type',
            'content' => 'article'
        ];
        $meta_tags[] = (object)[
            'property' => 'og:title',
            'content' => $attrs->title
        ];
        $meta_tags[] = (object)[
            'property' => 'og:description',
            'content' => $attrs->description
        ];
        $meta_tags[] = (object)[
            'property' => 'og:image',
            'content' => $imgSrc
        ];
        $meta_tags[] = (object)[
            'name' => 'twitter:title',
            'content' => $attrs->title
        ];
        $meta_tags[] = (object)[
            'name' => 'twitter:description',
            'content' => $attrs->description
        ];
        $meta_tags[] = (object)[
            'name' => 'twitter:image',
            'content' => $imgSrc
        ];

        if ($attrs->data && isset($data->image_width)) {
            $meta_tags[] = (object)[
                'property' => 'og:image:width',
                'content' => $attrs->data->image_width
            ];
        }
        if ($attrs->data && isset($attrs->data->image_height)) {
            $meta_tags[] = (object)[
                'property' => 'og:image:height',
                'content' => $attrs->data->image_height
            ];
        }
        $indexCnf = (object)[
            'icon' => (object)['href' => '/assets/img/icon.png', 'type' => 'image/png'],
            'layout_group' => $attrs->layout_group

        ];
        /*we need to pass read app to let the blade access the ux vendor files and styles*/
        $ux_resources = $attrs->ux_resources;
        $cnf = static::buildUXAppConfig($ux_resources,
            $attrs->title, $attrs->appGroup, $meta_tags, $attrs->data, $indexCnf);
        return $cnf;
    }
}