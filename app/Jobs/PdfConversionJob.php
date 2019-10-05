<?php

namespace App\Jobs;

use App\Services\PSDocConverter;
use App\Services\PSDocHelper;
use App\Services\PSEmailManager;
use App\Contracts\NotifManager;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Services\PdfToImgConverter;
use App\Services\PSDocService;
use Illuminate\Support\Facades\Storage;
use App\Story;
use App\BusyStory;
use App\File;
use Illuminate\Support\Facades\Log;

class PdfConversionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $pdfToImgConverter;

    private $psDocConverter;

    private $pdfFile;

    private $storyId;

    private $outputDir;

    private $serverRoot;

    private $maxPages;

    private $firstPage;

    private $lastPage;


    /**
     * @var PSEmailManager
     */
    protected $psEmailManager;

    /**
     * SlicedPdfConversionJob constructor.
     * @param $storyId
     * @param $pdfId
     * @param $serverRoot
     * @param $maxPages
     * @param $firstPage
     * @param $lastPage
     */
    public function __construct($storyId, $pdfId, $serverRoot, $maxPages, $firstPage, $lastPage)
    {

        $this->pdfFile = File::find($pdfId);

        $this->storyId = $storyId;

        $this->outputDir = Storage::path('stories/' . $storyId);

        $this->serverRoot = $serverRoot;

        $this->maxPages = $maxPages;

        $this->firstPage = $firstPage;

        $this->lastPage = $lastPage;

        if (
        !(
            file_exists($this->outputDir) && empty(Story::find($storyId) && empty($this->pdfFile))
        )) {
            mkdir($this->outputDir, 0777, true);
        }
    }

    public function handle(PdfToImgConverter $pdfToImgConverter,
                           PSDocConverter $psDocConverter,
                           PSDocHelper $helper)
    {
        if ($this->firstPage >= $this->lastPage) {
            return;
        }

        $this->pdfToImgConverter = $pdfToImgConverter;
        $this->psDocConverter = $psDocConverter;
        $pdfFilePath = Storage::path($this->pdfFile->path);
        if (!(file_exists($this->outputDir) && file_exists($pdfFilePath)) || empty($this->pdfFile)) {
            return;
        }

        if ($this->firstPage > $this->maxPages) {
            return;
        }
        $this->lastPage = min([$this->maxPages, $this->lastPage]);
        $slicedSet = $helper->makeRangeSet(
            $this->firstPage,
            $this->lastPage,
            10
        );

        foreach ($slicedSet as $sub) {
            $this->proceed($pdfFilePath, $sub['start'], $sub['end']);
        }
        // this how you can get job id
        // for this train InteractsWithQueue must be included
        $jobId = $this->job->getJobId();
        $this->psDocConverter->jobReadySignal(
            $this->storyId, $jobId, $this->serverRoot, $this->firstPage, $this->lastPage
        );
    }

    private function proceed($pdfFilePath, $start, $end)
    {

        try {
            $all_resolutions = $this->pdfToImgConverter
                ->makePagesByRange(
                    $pdfFilePath, $this->outputDir, $start, $end, [300]
                );
        } catch (\Exception $e) {
            Log::error($e);
        }
        if (empty($all_resolutions)) {
            return;
        }
        /**
         * $note: the result will be in following format
         *
         *       array(
         *          '300' => [..$file_paths],
         *          ...other_resolutions => [...]
         *        );
         */
        foreach ($all_resolutions as $resolution => $pages) {

            $this->psDocConverter->saveSetOfPages(
                $this->storyId, $pages, $resolution, $start
            );
        }
        if (empty($all_resolutions['300'])) {
            return;
        }
        $pages = $all_resolutions['300'];
        if ($start === 1 && !(empty($pages) || empty($pages[1]))) {
            try {
                $coverPath = $this->outputDir . '/pages/cover.jpg';
                $this->pdfToImgConverter->makeThumbnail($pages[1], $coverPath, '200x293');
                if (file_exists($coverPath)) {
                    list($width, $height) = getimagesize($coverPath);
                    $p = explode('storage/app/', $coverPath);
                    $c = new File();
                    $c->fill([
                        'name' => 'cover.jpg',
                        'path' => count($p) > 1 ? $p[1] : $p[0]
                    ]);
                    $c->save();
                    $this->psDocConverter->addPage($this->storyId, $c->id, [
                        'number' => 0,
                        'is_cover' => true,
                        'width' => $width,
                        'height' => $height
                    ]);
                }
            } catch (\Exception $e) {
                Log::error($e);
            }
        }
    }


}
