<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;


trait StoryImages
{

    public function getImage($story_id, $img_name)
    {
        $file_path = 'stories/' . $story_id . '/images/' . $img_name;
        if (Storage::exists($file_path)) {
            $mime_type = Storage::mimeType($file_path);
            $img = Storage::disk('local')->get($file_path);
            return array(
                'image' => $img,
                'mime' => $mime_type
            );
        }
        return null;
    }

    public function removeAllImages($storyId, $deleteRoot = false)
    {
        $root_path = 'stories/' . $storyId;
        $dir_path = 'stories/' . $storyId . '/images/';
        if (Storage::exists($dir_path)) {
            $images = Storage::files($dir_path);
            Storage::delete($images);
            Storage::deleteDirectory($dir_path);
        }
        if ($deleteRoot === true && Storage::exists($root_path)) {
            Storage::deleteDirectory($root_path);
        }
    }


    public function getImageList($storyId)
    {
        $dir_path = 'stories/' . $storyId . '/images/';
        $res = array();
        if (Storage::exists($dir_path)) {
            $images = Storage::files($dir_path);
            foreach ($images as $img) {
                $mime = Storage::mimeType($img);
                /*Making sure we select only image files*/
                if (!$this->_string_starts_with($mime, 'image/')) {
                    continue;
                }
                $meta = Storage::disk('local')->getMetaData($img);
                $path_array = explode('/', $img);
                $name = array_pop($path_array);
                $path = '/api/story_image/' . $storyId . '/' . $name;
                $res[] = array(
                    'name' => $name,
                    'src' => $path,
                    'mime' => $mime,
                    'timestamp' => $meta['timestamp'],
                    'size' => $meta['size']
                );
            }
        }
        return $res;
    }

    static public function getPreviewImage($images = array(), $def = null)
    {
        if (!is_array($images)) {
            return $def;
        }
        $src = null;
        $coll = collect($images);
        $preview = $coll->filter(function ($i) {
            return strpos($i['name'], 'preview_cover') === 0;
        })->first();

        $preview2 = $coll->filter(function ($i) {
            return strpos($i['name'], 'wide_browse_cover') === 0;
        })->first();

        $preview3 = $coll->filter(function ($i) {
            return strpos($i['name'], 'browse_cover') === 0;
        })->first();

        $cover = $coll->filter(function ($i) {
            return strpos($i['name'], 'cover') === 0;
        })->first();
        return !empty($preview) ? $preview : !empty($preview2) ?
            $preview2 : !empty($preview3) ?
                $preview3 : !empty($cover) ? $cover : !empty($images[0]) ? $images[0] : $def;
    }

    /**
     * Tests if a text starts with an given string.
     * @param $haystack
     * @param $needle
     * @return bool
     */
    private function _string_starts_with($haystack, $needle)
    {
        // Recommended version, using strpos
        return strpos($haystack, $needle) === 0;
    }

}