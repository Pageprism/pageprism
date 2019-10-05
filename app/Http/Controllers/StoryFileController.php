<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Traits\StoryImages;

class StoryFileController extends Controller
{
    use StoryImages;

    public function upload_image(Request $request, $story_id)
    {
        $file = $request->file('image');
        $path = $file->storeAs(
            'stories/' . $story_id . '/images', $file->getClientOriginalName()
        );
        return response()->json([
            'message' => $file->getClientOriginalName() . ' stored successfully'
        ], 200);
    }

    public function get_image(Request $request, $story_id, $img_name)
    {
        $result = $this->getImage($story_id, $img_name);
        if(empty($result)){
            return response([
                'message' => 'image not found!'
            ], 404)
                ->header('Content-Type', 'application/json');
        }
        return response($result['image'], 200)->header('Content-Type', $result['mime']);
    }

    public function get_image_list(Request $request, $story_id)
    {
        $dir_path = 'stories/' . $story_id . '/images/';
        if (Storage::exists($dir_path)) {
            $res = $this->getImageList($story_id);
            return response($res, 200);
        }
        return response([
            'message' => 'image not found!'
        ], 404)
            ->header('Content-Type', 'application/json');
    }


}
