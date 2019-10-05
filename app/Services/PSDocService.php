<?php

namespace App\Services;


use App\BusyStory;
use App\Contracts\NotifManager;
use App\EmailNotification;
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

class PSDocService
{

    use DispatchesJobs, CTRUtils;

    private $pdfToImgConverter;

    protected $notifManager;

    protected $fileManager;

    protected $helper;

    /**
     * PSDocService constructor.
     * @param PdfToImgConverter $pdfToImgConverter
     * @param NotifManager $notifManager
     * @param PSDocHelper $helper
     * @param AppFilesManager $fileManager
     */
    public function __construct(
        PdfToImgConverter $pdfToImgConverter, NotifManager $notifManager,
        PSDocHelper $helper, AppFilesManager $fileManager)
    {
        $this->pdfToImgConverter = $pdfToImgConverter;
        $this->notifManager = $notifManager;
        $this->helper = $helper;
        $this->fileManager = $fileManager;
    }

    public function create($userId, Array $storyData = [], Array $metaData = [],
                           Array $settingData = [], Array $tags = [])
    {

        $doc = new Story();
        $doc->fill($storyData);
        $doc->type = 'ps/doc';
        $doc->content_type = 'multi-image/pages';
        $doc->user_id = $userId;
        $doc->save();

        $this->addDocToCollection($doc->id, $storyData['collection_id']);
        foreach ($metaData as $key => $values) {

            foreach ($values as $v) {
                if (!empty($v)) {
                    $this->createStoryMeta($doc->id, $key, $v);
                }
            }
        }

        foreach ($settingData as $key => $values) {

            foreach ($values as $v) {
                if (!empty($v) || ($v === 0 || $v === false)) {
                    $this->createStorySetting($doc->id, $key, $v);
                }
            }
        }

        foreach ($tags as $tagName) {
            $this->createStoryTag($doc->id, $tagName);
        }
        return $doc;
    }

    public function save($docId, $userId, Array $storyData = [], Array $metaData = [],
                         Array $settingData = [], Array $tags = [])
    {
        $doc = Story::find($docId);
        if (empty($doc)) {
            return null;
        }

        $doc->fill($storyData);
        $doc->type = 'ps/doc';
        $doc->content_type = 'multi-image/pages';
        $doc->user_id = $userId;
        $doc->update();

        $this->addDocToCollection($docId, $storyData['collection_id']);

        $doc->meta()->detach();
        $doc->settings()->detach();
        $doc->tags()->detach();

        foreach ($metaData as $key => $values) {
            foreach ($values as $v) {
                if (!empty($v)) {
                    $this->createStoryMeta($doc->id, $key, $v);
                }
            }

        }


        foreach ($settingData as $key => $values) {
            if (!empty($values)) {
                foreach ($values as $v) {
                    if (!empty($v) || ($v === 0 || $v === false)) {
                        $this->createStorySetting($doc->id, $key, $v);
                    }
                }
            }
        }

        foreach ($tags as $tagName) {
            $this->createStoryTag($doc->id, $tagName);
        }
        return $doc;
    }

    public function removeCollection($collId)
    {
        $coll = Series::where('id', $collId)
            ->where('type', 'ps/collection')
            ->first();
        if (empty($coll)) {
            return;
        }

        $coll->stories->each(function ($doc) {
            $this->remove($doc->id);
        });
        $coll->delete();
    }

    public function remove($docId)
    {
        $doc = Story::where('id', $docId)
            ->where('type', 'ps/doc')
            ->first();
        if (empty($doc)) {
            return;
        }
        $doc->attachments->each(function ($f) {
            if (is_file(Storage::path($f->path))) {
                unlink(Storage::path($f->path));
            }
            $f->delete();
        });
        StoryPage::where('story_id', $docId)
            ->get()
            ->each(function ($p) {
                if (!empty($p->file)) {
                    if (is_file(Storage::path($p->file->path))) {
                        unlink(Storage::path($p->file->path));
                    }
                    $p->file->delete();
                    $p->delete();
                }
            });
        File::where('path', 'LIKE', "stories/${docId}/%")
            ->get()
            ->each(function ($f) {
                if (is_file(Storage::path($f->path))) {
                    unlink(Storage::path($f->path));
                }
                $f->delete();
            });
        $doc->delete();
        if (is_dir(Storage::path("stories/${docId}"))) {
            $this->fileManager->rmdirRecursive(Storage::path("stories/${docId}"));
        }
    }

    public function addDocToCollection($docId, $collId)
    {
        $collection = Series::where('type', 'ps/collection')->where('id', $collId)->first();
        $doc = Story::find($docId);
        if (empty($doc) || empty($collection)) {
            return false;
        }
        //allowing doc be only part of 1 collection at max
        if (!empty($doc->series)) {
            $doc->series->each(function ($s) use ($doc) {
                $doc->series()->detach($s);
            });
        }

        if (!(empty($collection->stories) || $collection->stories->contains('id', $doc->id))) {
            $collection->stories()->save($doc);
        }
        return true;

    }

    public function createStoryTag($doc_id, $tagName)
    {
        $doc = Story::find($doc_id);
        if (empty($doc) || empty($tagName)) {
            return null;
        }

        $tag = Tag::where('name', 'LIKE', $tagName)->first();

        if (empty($tag)) {
            $tag = new Tag();
            $tag->fill(['name' => $tagName]);
            $tag->save();
        }

        if (!$this->storyHasTag($doc, $tag)) {
            $doc->tags()->save($tag);
        }
        return $tag;
    }

    /**
     * @param $doc_id
     * @param $key
     * @param $value
     * @return MetaValue|null
     */
    public function createStoryMeta($doc_id, $key, $value)
    {

        $doc = Story::find($doc_id);
        $keyName = strtolower(trim($key));
        $valueStr = trim($value);
        if (empty($doc) || empty($keyName) || empty($valueStr)) {
            return null;
        }
        $metaKey = MetaKey::where('name', $keyName)->first();
        if (empty($metaKey)) {
            $metaKey = new MetaKey();
            $metaKey->name = $keyName;
            $metaKey->save();
        }
        $metaValue = MetaValue::where('meta_key_id', $metaKey->id)->where('value', $valueStr)->first();
        if (empty($metaValue)) {
            $metaValue = new MetaValue();
            $metaValue->fill([
                'meta_key_id' => $metaKey->id,
                'value' => $valueStr
            ]);
            $metaValue->save();
        }
        $exists = empty($doc->meta) ?
            false : $doc->meta->filter(function ($m) use ($metaKey, $valueStr) {
                return $m->meta_key_id == $metaKey->id && $m->value == $valueStr;
            })->count() > 0;
        if (!$exists) {
            $doc->meta()->save($metaValue);
        }
        return $metaValue;
    }

    /**
     * @param $doc_id
     * @param $key
     * @param $value
     * @return SettingValue|null
     */
    public function createStorySetting($doc_id, $key, $value)
    {
        $doc = Story::find($doc_id);
        $keyName = strtolower(trim($key));
        $valueStr = $value === false || $value === 0 ? 0 : trim($value);
        if (empty($doc) || empty($keyName) || ($valueStr !== 0 && empty($valueStr))) {
            return null;
        }
        $settingKey = SettingKey::where('name', $keyName)->first();
        if (empty($settingKey)) {
            $settingKey = new SettingKey();
            $settingKey->name = $keyName;
            $settingKey->save();
        }

        // if we want to allow max value per key
        //        if (!empty($doc->settings)) {
        //            $doc->settings->each(function ($s) use ($doc, $settingKey) {
        //                if ($s->setting_key_id === $settingKey->id) {
        //                    $doc->settings()->detach($s);
        //                }
        //            });
        //        }

        $settingValue = SettingValue::where('setting_key_id', $settingKey->id)->where('value', $valueStr)->first();
        if (empty($settingValue)) {
            $settingValue = new SettingValue();
            $settingValue->fill([
                'setting_key_id' => $settingKey->id,
                'value' => $valueStr
            ]);
            $settingValue->save();
        }
        $exists = empty($doc->settings) ?
            false : $doc->settings->filter(function ($s) use ($settingKey, $valueStr) {
                return $s->setting_key_id == $settingKey->id && $s->value == $valueStr;
            })->count() > 0;
        if (!$exists) {
            $doc->settings()->save($settingValue);
        }
        return $settingValue;
    }

}