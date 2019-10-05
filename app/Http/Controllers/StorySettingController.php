<?php

namespace App\Http\Controllers;

use App\StoryPage;
use Illuminate\Http\Request;
use App\Services\PSDocBodyDecorator;
use Validator;
use App\Story;
use App\StoryMeta;
use App\StorySetting;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use App\Services\AwrCTRHelper;
use App\Services\PSDocService;
use App\Contracts\NotifManager;


class StorySettingController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    /**
     * @var PSDocService
     */
    protected $docService;


    /**
     * MyPSDocController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param PSDocService $docService
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper,
                                PSDocService $docService)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->docService = $docService;
    }

    public function getModel()
    {
        return StorySetting::class;
    }

    public function onResult($res)
    {
        $res->settingValue;
        if (!empty($res->settingValue)) {
            $res->settingValue->settingKey;
            $res->settingValue->key = $res->settingValue->settingKey->name;
            unset($res->settingValue->settingKey);
        }
    }

    public function createOne(Request $request)
    {
        $data = $request->all();
        $settingVal = $this->docService->createStorySetting($data['story_id'], $data['key'], $data['value']);
        return $settingVal;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'value' => 'required',
            'key' => 'required',
            'story_id' => 'required'
        ]);
    }





//    public function listAll(Request $request, $key = null, $value = null)
//    {
//        return parent::listAll($request, [
//            'type' => 'ps/doc',
//            'content_type' => 'multi-image/pages',
//            'status' => 'published'
//        ], null);
//    }
}
