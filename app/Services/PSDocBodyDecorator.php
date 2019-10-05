<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 6/11/18
 * Time: 4:35 PM
 */

namespace App\Services;


use App\BusyStory;
use App\Story;
use App\StoryPage;
use App\StorySeries;
use App\Traits\CTRUtils;
use Illuminate\Support\Facades\Storage;

class PSDocBodyDecorator
{

    use CTRUtils;

    /**
     * PsDocBodyDecorator constructor.
     */
    public function __construct()
    {

    }

    public function decorate(Story $doc)
    {
        $this->decorateItem($doc, true);
    }

    public function decorateForList($res)
    {
        $this->decorateItem($res, false);
    }

    private function decorateItem($doc, $setPages = true)
    {
        if (empty($doc)) {
            return;
        }
        unset($doc->content);
        unset($doc->snippet);
        $doc->tags;
        if (!empty($doc->user)) {
            unset($doc->user->email);
            unset($doc->user->phone);
        }
        if (!empty($doc->meta)) {
            $doc->meta->each(function ($m) {
                $m->metaKey;
                $m->key = $m->metaKey->name;
                unset($m->metaKey);
            });
        }
        if (!empty($doc->settings)) {
            $doc->settings->each(function ($m) {
                $m->settingKey;
                $m->key = $m->settingKey->name;
                unset($m->settingKey);
            });
        }
        if (!empty($doc->attachments)) {
            $doc->attachments->each(function ($a) {
                $a->src = '/api/file/' . $this->encodeItemShareId($a->id) . '/' . $a->name;
                $a->mime = Storage::mimeType($a->path);
                unset($a->path);
            });
        }

        if (!empty($doc->storyPages)) {
            $doc->storyPages->each(function ($p) {
                $p->src = '/api/story_image_page/' . $this->encodeItemShareId($p->id);
                $p->is_cover = $p->is_cover == 1;
                return $p;
            });
            $doc->cover = $doc->storyPages->filter(function ($p) {
                return $p->is_cover;
            })->first();
            $doc->pages = $doc->storyPages->filter(function ($p) {
                return !$p->is_cover;
            })->sortBy('number')->flatten();
            $doc->page_numbers = $doc->pages->count();
        }
        unset($doc->storyPages);
        if (!$setPages) {
            unset($doc->pages);
        }
        $doc->is_busy = BusyStory::where('story_id', $doc->id)->get()->count() > 0;
        $doc->collection_membership = StorySeries::where('story_id', $doc->id)->get()
            ->map(function ($pivot) {
                return $pivot->series_id;
            });
//        $doc->is_busy = true;
    }
}