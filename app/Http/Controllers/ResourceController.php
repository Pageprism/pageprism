<?php

namespace App\Http\Controllers;

use App\Services\AppFilesManager;
use Illuminate\Http\Request;
use App\Traits\CTRUtils;
use App\User;
use App\File;
use App\Story;
use App\Contracts\NotifManager;

class ResourceController extends Controller
{
    use  CTRUtils;

    /**
     * @var \App\Contracts\NotifManager
     */
    protected $notifManager;

    /**
     * @var AppFilesManager
     */
    protected $fileManager;

    /**
     * PSResourceController constructor.
     * @param NotifManager $notifManager
     * @param AppFilesManager $fileManager
     */
    public function __construct(NotifManager $notifManager, AppFilesManager $fileManager)
    {
        $this->notifManager = $notifManager;
        $this->fileManager = $fileManager;
    }


    /**
     * @param Request $request
     * @param $encoded_id
     * @return mixed
     */
    public function getStoryImagePage(Request $request, $encoded_id)
    {

        $decoded = $this->decodeItemShareId($encoded_id);

        if ($this->fileManager->storyPageImageExists($decoded->id)) {
            $img = $this->fileManager->getStoryPageImage($decoded->id);
            return response($img['content'], 200)->header('Content-Type', $img['mime']);
        }
        return response([
            'message' => 'image not found!'
        ], 404)
            ->header('Content-Type', 'application/json');
    }


    /**
     * @param Request $request
     * @param $encoded_id
     * @param $file_name
     * @return mixed
     */
    public function getFile(Request $request, $encoded_id, $file_name = null)
    {
        $decoded = $this->decodeItemShareId($encoded_id);

        if ($this->fileManager->fileExists($decoded->id)) {
            $file = $this->fileManager->getFile($decoded->id);
            return response($file['content'], 200)->header('Content-Type', $file['mime']);
        }
        return response([
            'message' => 'file not found!'
        ], 404)
            ->header('Content-Type', 'application/json');
    }

    /**
     * @param Request $request
     * @param $story_id
     * @return mixed
     */
    public function uploadStoryAttachment(Request $request, $story_id)
    {
        $story = Story::find($story_id);
        $uploadFile = $request->file('attachment');

        if (empty($story) || empty($uploadFile)) {
            return response([
                'message' => 'Bad upload attachment request!',
                'reason' => empty($story) ? 'Story does not exists' : 'upload file missing'
            ], 400)
                ->header('Content-Type', 'application/json');
        }

        $res = $this->fileManager->saveUploadAsAttachment($story, $uploadFile);

        return response(!empty($res) ?
            $res : ['message' => 'something went wrong'],
            !empty($res) ? 200 : 500)->header('Content-Type', 'application/json');
    }

}
