<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 6/11/18
 * Time: 6:55 PM
 */

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\StoryPage;
use App\File;
use App\Story;
use App\Traits\CTRUtils;

class AppFilesManager
{

    //$svc->convert(182,3442,'https://www.pageshare.fi')
    use CTRUtils;

    /**
     * AppFilesManager constructor.
     */
    public function __construct()
    {

    }

    public function getFile($file_id)
    {
        $file = File::find($file_id);
        if (!empty($file) && file_exists(Storage::path($file->path))) {
            $fileCnt = Storage::disk('local')->get($file->path);
            $mime = Storage::mimeType($file->path);
            return [
                'content' => $fileCnt,
                'mime' => $mime
            ];
        }
    }

    public function getStoryPageImage($page_id)
    {

        $page = StoryPage::find($page_id);
        $file = !empty($page) ? File::find($page->file_id) : null;
        if (!empty($file) && file_exists(Storage::path($file->path))) {
            $img = Storage::disk('local')->get($file->path);
            $mime = Storage::mimeType($file->path);
            return [
                'content' => $img,
                'mime' => $mime
            ];
        }
    }

    public function fileExists($file_id)
    {
        $file = File::find($file_id);
        return !empty($file) && file_exists(Storage::path($file->path));
    }

    public function storyPageImageExists($page_id)
    {
        $page = StoryPage::find($page_id);
        $file = !empty($page) ? File::find($page->file_id) : null;
        return !empty($file) && file_exists(Storage::path($file->path));
    }


    public function saveUploadAsAttachment(Story $story, $uploadFile)
    {
        if (empty($story) || empty($uploadFile)) {
            return null;
        }
        $originalName = $uploadFile->getClientOriginalName();
        $ext = pathinfo($uploadFile->getClientOriginalName(), PATHINFO_EXTENSION);
        $name = uniqid() . '.' . $ext;
        $rootDir = 'stories/' . $story->id;
        $dir = $rootDir . '/attachments';
        if (!is_dir(Storage::path($rootDir))) {
            mkdir(Storage::path($rootDir), 0777, true);
        }
        if (!is_dir(Storage::path($dir))) {
//          Storage::makeDirectory($dir,0777);
            mkdir(Storage::path($dir), 0777, true);
        }

        $uploadFile->storeAs(
            $dir, $name
        );
        $file = new File();
        $path = $dir . '/' . $name;
        $file->fill([
            'name' => $originalName,
            'path' => $path
        ]);
        $file->save();
        $story->attachments()->save($file);

        return [
            'status' => 'success',
            'file_id' => $file->id,
            'name' => $originalName,
            'mime' => Storage::mimeType($path),
            'src' => '/api/file/' . $this->encodeItemShareId($file->id) . '/' . $originalName
        ];
    }


    public function cleanupOrphanDirs()
    {
        $dirList = [];
        File::where('path', 'Like', 'stories/%')
            ->get()
            ->each(function ($f) use (&$dirList) {
                $parts = explode('/', $f->path);
                if (count($parts) > 1 && empty(Story::find($parts[1]))) {
                    if (!in_array(Storage::path("stories/${parts[1]}"), $dirList)) {
                        $dirList[] = Storage::path("stories/${parts[1]}");
                    }
                    if (is_file(Storage::path($f->path))) {
                        unlink(Storage::path($f->path));
                    }
                    $f->delete();
                }
            });
        collect($dirList)->each(function ($d) {
            $this->rmdirRecursive($d);
        });
        foreach (scandir(Storage::path('stories/')) as $dir) {
            if (is_numeric($dir) && Story::where('id', $dir)->count() < 1) {
                $this->rmdirRecursive(Storage::path("stories/${dir}"));
            }
        }
        return $dirList;
    }

    public function rmdirRecursive($dir)
    {
        if (!is_dir($dir)) {
            return;
        }
        foreach (scandir($dir) as $file) {
            if ('.' === $file || '..' === $file) {
                continue;
            }
            if (is_dir("$dir/$file")) {
                $this->rmdirRecursive("$dir/$file");
            } else {
                unlink("$dir/$file");
            }
        }
        rmdir($dir);
    }
}