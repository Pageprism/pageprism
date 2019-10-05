<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Traits\UserImages;
use App\Traits\CTRUtils;
use App\User;
use App\Contracts\NotifManager;

class UserFileController extends Controller
{
    use UserImages, CTRUtils;

    /**
     * @var \App\Contracts\NotifManager
     */
    protected $notifManager;

    /**
     * UserFileController constructor.
     * @param NotifManager $notifManager
     */
    public function __construct(NotifManager $notifManager)
    {
        $this->notifManager = $notifManager;
    }

    public function uploadProfileImage(Request $request)
    {
        $user = $request->user();
        $user_id = $user['id'];

        $file = $request->file('image');
        $ext = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
        $shareId = $this->encodeItemShareId($user_id, null);
        $name = uniqid() . '.' . $ext;

        $user['picture'] = '/api/profile_image/' . $shareId . '/' . $name;
        $user->save();

        $path = $file->storeAs(
            'profiles/' . $shareId . '/images', $name
        );

        $this->notifManager->broadcastInApp('update-profile-picture', null, null, 'users', $user->id);
        return response()->json([
            'message' => $path . ' stored successfully'
        ], 200);
    }

    public function getProfileImage(Request $request, $profile_key, $img_name = null)
    {
        $key = $this->decodeItemShareId($profile_key);
        $user = User::find($key->id);

        if (empty($user)) {
            return response([
                'message' => 'image not found!'
            ], 404)
                ->header('Content-Type', 'application/json');
        }
        if (empty($img_name)) {
            $u_pic = explode('/', $user->picture);
            $img_name = end($u_pic);
        }
        $result = $this->getImage($profile_key, $img_name);
        if (empty($result)) {
            return response([
                'message' => 'image not found!'
            ], 404)
                ->header('Content-Type', 'application/json');
        }
        return response($result['image'], 200)->header('Content-Type', $result['mime']);
    }

    public function getProfileImageList(Request $request, $profile_key)
    {
        $key = $this->decodeItemShareId($profile_key);
        $user = User::find($key->id);
        if (empty($user)) {
            return response([
                'message' => 'image list not found!'
            ], 404)
                ->header('Content-Type', 'application/json');
        }
        $dir_path = 'profiles/' . $profile_key . '/images/';
        if (Storage::exists($dir_path)) {
            $res = $this->getImageList($profile_key);
            return response($res, 200);
        }
        return response([
            'message' => 'image list not found!'
        ], 404)
            ->header('Content-Type', 'application/json');
    }


}
