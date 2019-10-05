<?php

namespace App\Http\Controllers;

use App\File;
use App\Services\PSDocConverter;
use App\StoryPage;
use Illuminate\Http\Request;
use App\Services\PSDocBodyDecorator;
use App\Story;
use App\Traits\CTRUtils;
use App\Contracts\AwrRestfulController;
use App\Services\AwrCTRHelper;
use App\Services\PSDocService;
use App\Contracts\NotifManager;
use Illuminate\Support\Facades\Validator;


class PSDocController extends AwrAPICTR implements AwrRestfulController
{
    use CTRUtils;

    /**
     * @var PSDocService
     */
    protected $docService;

    /**
     * @var PSDocConverter
     */
    protected $docConverter;

    /**
     * @var PSDocBodyDecorator
     */
    protected $docDecorator;

    /**
     * PSDocController constructor.
     * @param NotifManager $notifManager
     * @param AwrCTRHelper $awrCTRHelper
     * @param PSDocService $docService
     * @param PSDocConverter $psDocConverter
     * @param PSDocBodyDecorator $docDecorator
     */
    public function __construct(
        NotifManager $notifManager, AwrCTRHelper $awrCTRHelper,
        PSDocService $docService, PSDocConverter $psDocConverter,
        PSDocBodyDecorator $docDecorator
    )
    {
        parent::__construct($notifManager, $awrCTRHelper);
        $this->docService = $docService;
        $this->docDecorator = $docDecorator;
        $this->docConverter = $psDocConverter;
    }


    public function getModel()
    {
        return Story::class;
    }

    public function onResult($res)
    {
        $this->docDecorator->decorate($res);
    }

    public function findOne(Request $request, $id)
    {
        return Story::where('id', $id)
            ->where('type', 'ps/doc')
            ->where('content_type', 'multi-image/pages')
            ->where('status', 'published')
            ->first();
    }


    public function listAll(Request $request, $key = null, $value = null)
    {
        return parent::listAll($request, [
            'type' => 'ps/doc',
            'content_type' => 'multi-image/pages',
            'status' => 'published'
        ], null);
    }

    public function convert(Request $request, $doc_id, $pdf_id)
    {
        $user = $request->user();
        $story = Story::find($doc_id);
        $file = File::find($pdf_id);
        if (empty($user) || empty($story) || empty($file) || $story->user_id !== $user->id) {
            return response()->json([
                'forbidden' => 'convert not allowed',
                'pdf_file_ok' => !empty($file),
                'doc_file_ok' => !empty($story)
            ], 403);
        }

        $res = $this->docConverter->convert($doc_id, $pdf_id, $this->getServerRoot());

        return response()->json([
            'message' => $res ?
                'new convert job registered for document' : 'failed to register convert job'
        ], $res ? 200 : 500);
    }
}
