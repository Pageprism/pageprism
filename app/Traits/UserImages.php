<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;


trait UserImages
{

    public function getImage($profile_key, $img_name)
    {
        $file_path = 'profiles/' . $profile_key . '/images/' . $img_name;
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

    public function removeAllImages($profile_key, $deleteRoot = false)
    {
        $root_path = 'profiles/' . $profile_key;
        $dir_path = 'profiles/' . $profile_key . '/images/';
        if (Storage::exists($dir_path)) {
            $images = Storage::files($dir_path);
            Storage::delete($images);
            Storage::deleteDirectory($dir_path);
        }
        if ($deleteRoot === true && Storage::exists($root_path)) {
            Storage::deleteDirectory($root_path);
        }
    }


    public function getImageList($profile_key)
    {
        $dir_path = 'profiles/' . $profile_key . '/images/';
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
                $path = '/api/profile_image/' . $profile_key . '/' . $name;
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