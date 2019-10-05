<?php

namespace App\Http\Controllers;

use App\Services\PSDocBodyDecorator;
use Illuminate\Http\Request;
use Validator;
use App\Story;
use App\Series;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use App\Services\AwrCTRHelper;
use App\Services\PSDocService;
use App\Contracts\NotifManager;


class PSCollectionController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    /**
     * @var PSDocBodyDecorator
     */
    protected $docDecorator;

    /**
     * PSCollectionController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param PSDocBodyDecorator $docDecorator
     */
    public function __construct(NotifManager $notifManager, AwrCTRHelper $awrCTRHelper,
                                PSDocBodyDecorator $docDecorator)
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->docDecorator = $docDecorator;
    }

    public function isModelRelatedToAuthenticatedUser()
    {
        return true;
    }


    public function getModel()
    {
        return Series::class;
    }


    public function onResult($res)
    {
        if (!empty($res->stories)) {
            $stories = $res->stories->filter(function($s){
                return $s->status === 'published';
            })->flatten();
            $stories->each(function ($s) {
                $this->docDecorator->decorateForList($s);
            });
            //unset($res->stories);
            //$res->stories = $stories;
            $res->setRelation('stories',$stories);

        }
        $res->publisher;
    }

    public function createValidator(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required',
        ]);
    }

    public function findOne(Request $request, $id)
    {
        return Series::where('id', $id)
            ->where('type', 'ps/collection')
            ->first();
    }

    public function listAll(Request $request, $key = null, $value = null)
    {
        return parent::listAll($request, ['type' => 'ps/collection', 'user_id', 'status'], null);
    }

    public function createOne(Request $request)
    {
        $request->request->add(['type'=>'ps/collection']);
        return parent::createOne($request);
    }


}
