<?php

namespace App\Services;


use App\BusyStory;
use App\Contracts\NotifManager;
use App\EmailNotification;
use App\Jobs\PdfConversionJob;
use App\Series;
use App\Story;
use App\Tag;
use App\StoryAttachment;
use App\StoryPage;
use App\User;
use App\File;
use App\MetaKey;
use App\MetaValue;
use App\StoryMeta;
use App\SettingKey;
use App\SettingValue;
use App\StorySetting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Support\Facades\Log;
use App\Traits\CTRUtils;

class PSDocConverter
{

    use DispatchesJobs, CTRUtils;

    private $pdfToImgConverter;

    protected $notifManager;

    protected $helper;

    /**
     * PSDocService constructor.
     * @param PdfToImgConverter $pdfToImgConverter
     * @param NotifManager $notifManager
     * @param PSDocHelper $helper
     */
    public function __construct(PdfToImgConverter $pdfToImgConverter, NotifManager $notifManager, PSDocHelper $helper)
    {
        $this->pdfToImgConverter = $pdfToImgConverter;
        $this->notifManager = $notifManager;
        $this->helper = $helper;
    }


    public function jobReadySignal($storyId, $jobId, $serverRoot, $start, $end)
    {
        $this->notifManager->broadcastInApp(
            'ps-doc:end-sub-processing',
            null, null, 'stories', $storyId
        );
        $busyCount = BusyStory::where('story_id', $storyId)->count();
        $cond = $busyCount === 0 ||
            (
                $busyCount === 1 &&
                BusyStory::where('story_id', $storyId)
                    ->where('job_id', $jobId)->count() > 0
            );
        if (!$cond) {
            return;
        }

        $psEmailManager = $this->notifManager->getPSEmailManager();
        $psEmailManager->setServerRoot($serverRoot);
        $story = Story::find($storyId);
        $psEmailManager->notifyConversionJobReady($story, $jobId);
        if ($story->status === 'published') {
            $psEmailManager->notifySubscriberAboutNewDoc($story);
        }
        $this->notifManager->broadcastInApp('ps-doc:end-processing', null, null, 'stories', $storyId);
    }

    /**
     * Add pages as array where the indices are page numbers and values
     * the absolute paths
     * @param $story_id
     * @param $pages
     * @param $resolution
     */
    public function savePages($story_id, $pages, $resolution)
    {
        foreach ($pages as $idx => $img) {
            $nxtFile = new File();
            $path = explode('storage/app/', $img);

            $nxtFile->fill([
                'name' => basename($img),
                'path' => count($path) > 1 ? $path[1] : $path[0]
            ]);
            $nxtFile->save();

            list($width, $height) = getimagesize($img);

            /**
             * $idx starts from 1 here!
             */
            $this->addPage($story_id, $nxtFile->id, [
                'number' => $idx,
                'width' => $width,
                'height' => $height,
                'resolution' => $resolution
            ]);
        }
    }


    /**
     * 3442
     * @param $storyId
     * @param $pdfFileId
     * @param $serverRoot
     * @return bool
     */
    public function convert($storyId, $pdfFileId, $serverRoot)
    {
        $story = Story::find($storyId);
        $file = File::find($pdfFileId);

        /*
         * We remove entries so uploader can
         * be notified again for the same document.
         * Useful when re-convert feature is in use
         */
        EmailNotification::where('name', 'pdf-convert-job')
            ->where('user_id', $story->user_id)
            ->where('target_id', $storyId)
            ->where('target_type', 'stories')
            ->get()
            ->each(function ($ntf) {
                $ntf->delete();
            });
        if (empty($story) || empty($file)) {
            return false;
        }
        if (Storage::mimeType($file->path) !== 'application/pdf') {
            return false;
        }

        $this->notifManager->broadcastInApp(
            'ps-doc:start-processing', null,
            null, 'stories', $storyId
        );

        $maxPages = $this->helper->getPageCount(
            Storage::path($file->path)
        );
        $slicedPageSet = $this->helper->makeSubSets($pdfFileId, 30);
        foreach ($slicedPageSet as $chunk) {
            $bs = new BusyStory();
            $bs->fill([
                'story_id' => $storyId,
                'job_id' => $this->dispatch(
                    new PdfConversionJob(
                        $storyId, $pdfFileId, $serverRoot,
                        $maxPages, $chunk['start'], $chunk['end']
                    )
                )
            ]);
            $bs->save();
        }

        return true;
    }


    /**
     * @param $story_id
     * @param $pages
     * @param $resolution
     * @param $startIdx
     */
    public function saveSetOfPages($story_id, $pages, $resolution, $startIdx)
    {
        foreach ($pages as $idx => $img) {
            $nxtFile = new File();
            $path = explode('storage/app/', $img);

            $nxtFile->fill([
                'name' => basename($img),
                'path' => count($path) > 1 ? $path[1] : $path[0]
            ]);
            $nxtFile->save();

            list($width, $height) = getimagesize($img);


            /**
             * $idx starts from 1 here!
             */
            $this->addPage($story_id, $nxtFile->id, [
                'number' => $idx,
                'width' => $width,
                'height' => $height,
                'resolution' => $resolution
            ]);
        }
    }

    /**
     * @param $story_id
     * @param $file_id
     * @param array $data
     * @return bool
     */
    public function addPage($story_id, $file_id, Array $data = [])
    {
        $story = Story::find($story_id);
        $file = File::find($file_id);

        if (empty($story) || empty($file) || !isset($data['number'])) {
            return false;
        }
        if (isset($data['is_cover']) && $data['is_cover']) {
            $current = StoryPage::where('story_id', $story_id)
                ->where('number', $data['number'])
                ->where('is_cover', true)
                ->get();
        } else {
            $current = StoryPage::where('story_id', $story_id)
                ->where('number', $data['number'])
                ->where('resolution', $data['resolution'])
                ->get();
        }
        if (!empty($current)) {
            $current->each(function ($c) {
                $cFile = File::find($c->file_id);
                if (!empty($cFile)) {
                    $cFile->delete();
                }
            });
            /*
             * DB "cascade on delete" will cause the items be deleted!
             * */
            //$current->delete();
        }

        $page = new StoryPage();
        $page->fill($data);
        /** @noinspection PhpUndefinedFieldInspection */
        $page->story_id = $story_id;
        /** @noinspection PhpUndefinedFieldInspection */
        $page->file_id = $file_id;
        $page->save();
        return true;
    }

}