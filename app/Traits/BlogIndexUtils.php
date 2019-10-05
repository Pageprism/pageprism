<?php

namespace App\Traits;

use App\User;
use App\Story;
use App\Tag;
use App\CoverStory;
use function foo\func;
use Illuminate\Support\Facades\DB;
use App\Following;

trait BlogIndexUtils
{
    public function createIndexResponse($user_id, $device_session_id)
    {
        $top_categories = $this->getFamousCategories(5);

        $user_top_tags = !(empty($user_id) && empty($device_session_id)) ?
            $this->getTagsBasedOnUserReadings($user_id, $device_session_id) : [];
        $cover_story = $this->getCoverStory();
        $excludes = !empty($cover_story) ? [$cover_story->id] : [];
        $recommended = $this->getRecommendedStories(4, $user_id, $device_session_id, $excludes);
        $excludes = array_merge($excludes, $recommended->map(function ($r) {
            return $r->id;
        })->toArray());
        $top = $this->getTopStories(4, $excludes);
        $excludes = array_merge($excludes, $top->map(function ($r) {
            return $r->id;
        })->toArray());
        if ($recommended->count() < 4) {
            $moreTop = $this->getTopStories(4 - $recommended->count(), $excludes, $user_id);
            $recommended = $recommended->merge($moreTop);
            $excludes = array_merge($excludes, $moreTop->map(function ($r) {
                return $r->id;
            })->toArray());
        }

        $latest = $this->getLatestStories(500, $excludes);
        $continue_reading = $this->getContinueReadingSuggestion($user_id, $device_session_id);

//        'latest_count' => $latest->count(),
//            'excludes' => $excludes,
        return [
            'top_categories' => $top_categories,
            'user_top_tags' => $user_top_tags,
            'cover_story' => $cover_story,
            'continue_reading' => $continue_reading,
            'recommended' => $recommended,
            'top' => $top,
            'latest' => $latest
        ];
    }

    public function createCategoryIndexResponse($category, $amount, $user_id, $device_session_id)
    {

        $top_categories = $this->getFamousCategories(5);
        $latest = $this->getLatestCategoryStories($category, $amount, []);

        return [
            'top_categories' => $top_categories,
            'latest' => $latest
        ];
    }

    /**
     *
     * @note This method assume that the ProfileUtils trait is also loaded into the the class!
     * @param $query
     * @param int $amount
     * @param $user_id
     * @param $device_session_id
     * @return \stdClass
     */
    public function createSearchResponse($query, $amount = 100, $user_id, $device_session_id)
    {
        $storiesRes = $this->searchByStories($query);
        $tagRes = $this->searchByTags($query);
        $byUserRes = $this->searchByUsers($query);
        $res = new \stdClass();
        $res->stories =  $storiesRes
            ->merge($tagRes)
            ->merge($byUserRes)
            ->flatten()
            ->unique('id')
            ->flatten()
            ->filter(function ($s) {
                return $s->type === 'blog' && $s->status === 'published';
            })
            ->map(function ($s) use ($query) {
                $s->search_content = stripos($s->content, $query) !== false ? 1 : 0;
                $s->search_title = stripos($s->title, $query) !== false ? 2 : 0;
                $l = new \stdClass();
                $l->story = $s;
                $this->setStoryForItem($l);
                $story = $l->story;
                /*requires ProfileUtils trait*/
                $this->setupProfileResult($story->user);
                unset($story->user->latest_shares);
                if (isset($story->search_username_total)) {
                    $story->search_user = $s->search_username_total;
                } else {
                    $story->search_user = stripos($story->user->name, $query) !== false ? 2 : 0;
                }
                if (isset($story->search_tag_total)) {
                    $story->search_tags = $story->search_tag_total;
                } else {
                    $story->search_tags = $story->tags->filter(function ($t) use ($query) {
                        return stripos($t->name, $query) !== false;
                    })->count() > 0 ? 1 : 0;
                }

                $story->search_total = $story->search_user + $story->search_tags +
                    $story->search_story + $story->search_title + $story->search_content;
                return $l->story;
            })
            ->sortByDesc('created_at')
            ->sortByDesc('search_total')
            ->take($amount)
            ->flatten();
        $users = $this->searchForUsers($query);
        $res->profiles = $users->map(function ($u){
            /*requires ProfileUtils trait*/
            $this->setupProfileResult($u);
            unset($u->latest_shares);
            return $u;
        })->take($amount);
        return $res;
    }

    /**
     * @param $story_id
     * @param $user_id
     * @return \Illuminate\Support\Collection
     */
    public function getSimilarStories($story_id, $user_id, $device_session_id)
    {
        $story = Story::find($story_id);
        if (empty($story)) {
            return collect([]);
        }
        $storyAuthorId = $story->user_id;
        $byTags = Tag::whereIn('id', $story->tags->map(function ($t) {
            return $t->id;
        }));
        foreach ($story->tags as $t) {
            $byTags = $byTags->orWhere('name', 'LIKE', '%' . $t->name . '%');
            if (count(explode(':', $t->name)) > 1) {
                $byTags = $byTags->orWhere('name', 'LIKE', '%' . explode(':', $t->name)[1] . '%');
            }
        }

        $byTags = $byTags->get()
            ->map(function ($t) {
                return $t->stories;
            })
            ->flatten()
            ->unique('id')
            ->map(function ($s) use ($user_id, $device_session_id) {
                $l = new \stdClass();
                $l->story = $s;
                $l->story->user_read_time = $this->getUserReadTime($s->id, $user_id, $device_session_id);
                $this->setStoryForItem($l);
                return $l->story;
            })
            ->filter(function ($s) use ($story_id, $storyAuthorId, $user_id) {
                return $s->type === 'blog' &&
                    $s->id != $story_id &&
                    $s->user_id !== $storyAuthorId &&
                    $s->user_id !== $user_id &&
                    $s->status === 'published';
            })
            ->flatten()
            ->sortByDesc('created_at')
            ->sortBy('user_read_time')
            ->take(4)
            ->flatten();
        $exclude = collect([$story_id]);
        $exclude = $exclude->merge($byTags->map(function ($s) {
            return $s->id;
        }));
        $byAuthor = Story::where('user_id', $story->user_id)
            ->where('type', 'blog')
            ->whereNotIn('id', $exclude)
            ->orderBy('created_at', 'DESC')
            ->get()
            ->map(function ($s) use ($user_id, $device_session_id) {
                $l = new \stdClass();
                $l->story = $s;
                $l->story->user_read_time = $this->getUserReadTime($s->id, $user_id, $device_session_id);
                $this->setStoryForItem($l);
                return $l->story;
            })
            ->filter(function ($s) use ($story_id, $user_id) {
                return $s->id != $story_id && $s->user_id !== $user_id && $s->status === 'published';
            })
            ->sortBy('user_read_time')
            ->take(4)
            ->flatten();

        return collect(['by_tags' => $byTags, 'by_author' => $byAuthor]);
    }

    public function searchByStories($query)
    {
        return Story::where('title', 'LIKE', '%' . $query . '%')
            ->orWhere('content', 'LIKE', '%' . $query . '%')
            ->get();
    }

    public function searchByTags($query)
    {
        return Tag::where('name', 'LIKE', '%' . $query . '%')
            ->orWhere('name', 'LIKE', 'category:' . $query . '%')
            ->orWhere('name', 'LIKE', 'label:' . $query . '%')
            ->orWhere('name', 'LIKE', '%:' . $query . '%')
            ->get()
            ->map(function ($t) {
                return $t->stories;
            })
            ->flatten()
            ->unique('id')
            ->map(function ($s) {
                $s->search_tag_total = 2;
                return $s;
            })
            ->filter(function ($s) {
                return $s->type === 'blog';
            })
            ->flatten();
    }

    public function searchByUsers($query)
    {
        $fullMatch = User::where('name', 'LIKE', '%' . $query . '%')
            ->get()
            ->map(function ($u) {
                return $u->stories;
            })
            ->flatten()
            ->map(function ($s) {
                $s->search_username_total = 2;
                return $s;
            })->filter(function ($s) {
                return $s->type === 'blog';
            });
        return $fullMatch;
    }

    public function searchForUsers($query)
    {
        $fullMatch = User::where('name', 'LIKE', '%' . $query . '%')->get();
        return $fullMatch;
    }

    public function getCoverStory($skip = array())
    {
        $cover_story = null;
        $active = CoverStory::active()->whereNotIn('id', $skip);
        $nextActive = CoverStory::nextActives()->whereNotIn('id', $skip);
        $pastActive = CoverStory::pastActives()->whereNotIn('id', $skip);
        if ($active->count() > 0) {
            $cover_story = $active->orderBy('starting')->first();
        } else if ($nextActive->count() > 0) {
            $cover_story = $nextActive->orderBy('starting')->first();
        } else if ($pastActive->count() > 0) {
            $cover_story = $pastActive->orderBy('ending', 'DESC')->first();
        }
        if (!empty($cover_story)) {
            $this->setStoryForItem($cover_story);
            if ($cover_story->story->status !== 'published') {
                $skip[] = $cover_story->id;
                return $this->getCoverStory($skip);
            }
            $cover_story->story->cover_story_title = $cover_story->title;
            $cover_story->story->cover_story_key = $cover_story->key;
            $cover_story->story->cover_story_starting = $cover_story->starting;
            $cover_story->story->cover_story_ending = $cover_story->ending;
            return $cover_story->story;
        }
        return null;
    }

    public function getLatestStories($amount = 100, $exclude = array())
    {
        return Story::whereNotIn('id', $exclude)
            ->orderBy('created_at', 'DESC')
            ->take($amount)
            ->get()
            ->map(function ($s) {
                $l = new \stdClass();
                $l->story = $s;
                $this->setStoryForItem($l);
                return $l->story;
            })
            ->filter(function ($s) {
                return $s->type === 'blog' && $s->status === 'published';
            })
            ->flatten();

    }

    public function getLatestCategoryStories($category, $amount = 100, $exclude = array())
    {
        if (empty($category)) {
            return collect([]);
        }

        return Tag::where('name', 'LIKE', '%' . $category . '%')
            ->orWhere('name', 'LIKE', 'category:' . $category . '%')
            ->orWhere('name', 'LIKE', 'label:' . $category . '%')
            ->get()
            ->map(function ($t) {
                return $t->stories;
            })
            ->flatten()
            ->unique('id')
            ->take($amount)
            ->flatten()
            ->map(function ($s) {
                $l = new \stdClass();
                $l->story = $s;
                $this->setStoryForItem($l);
                return $l->story;
            })
            ->filter(function ($s) use ($exclude) {
                return $s->type === 'blog' && !in_array($s->id, $exclude);
            })
            ->sortBy('created_at')
            ->flatten();

    }

    public function getTopStories($amount = 4, $exclude = array(), $user_id = null)
    {
        $top = DB::table('tracks')
            ->select(DB::raw('target_id, count(target_id) as clicks, SUM(duration) as read_time'))
            ->where('name','read@story')
            ->where('target_type', 'stories')
            ->whereNotIn('target_id', $exclude)
            ->groupBy('target_id')
            ->orderBy('clicks', 'DESC')
            ->get();
        foreach ($top as $h) {
            $h->story = Story::find($h->target_id);
            $this->setStoryForItem($h);
        }
        return $top
            ->filter(function($t){
                return !empty($t->story);
            })
            ->map(function ($t) {
                $t->story->read_time = $t->read_time;
                $t->story->clicks = $t->clicks;
                return $t->story;
            })->filter(function ($s) use ($user_id) {
                /*If user id is present then excluding user's own publications**/
                return $s->type === 'blog' && $s->status === 'published' && (empty($user_id) || $s->user_id != $user_id);
            })
            ->take($amount)
            ->flatten();
    }

    public function getRecommendedStories($amount = 4, $user_id = null, $device_session_id = null, $exclude = array())
    {
        $fav_tag_ids = $this->getTagIdsBasedOnUserReadings($user_id, $device_session_id);
        $limited_tg_ids = $fav_tag_ids->count() > 10 ? $fav_tag_ids->take(10) : $fav_tag_ids;
        /*
         * First we try to limit the search to be based on top 10 tags in the fav_tag_ids
         * But when we don't receive enough results we try again using all
         * tags in hope of more results this time.
         * **/
        $stories = DB::table('story_tag')
            ->whereIn('tag_id', $limited_tg_ids);
        if ($stories->get()->count() < $amount && $fav_tag_ids->count() > $limited_tg_ids->count()) {
            $stories = DB::table('story_tag')
                ->whereIn('tag_id', $fav_tag_ids);
        }

        return $stories
            ->whereNotIn('story_id', $exclude)
            ->get()
            ->map(function ($t) use ($stories) {
                $t->story = Story::find($t->story_id);
                $this->setStoryForItem($t);
                return $t->story;
            })
            ->filter(function ($s) use ($user_id, $device_session_id) {
                return $s->type === 'blog' && $s->status === 'published' &&
                    !$this->userHasAlreadyRead($s->id, 10000, $user_id, $device_session_id);
            })
            ->unique('id')
            ->flatten()
            ->take($amount);
    }

    public function getFamousCategories($amount = 5)
    {
        $tags = $this->getAllFamousTags();
        return $tags
            ->filter(function ($t) {
                return $t->isCategory;
            })
            ->flatten()
            ->take($amount);
    }

    /**
     * Getting set of tags which their associated stories has opened at least once.
     * The set is ordered (Desc) by the amount of clicks.
     * @return mixed
     */
    public function getAllFamousTags()
    {
        return DB::table('tracks')
            ->select(DB::raw('target_id, count(target_id) as clicks, SUM(duration) as read_time'))
            ->where('name','read@story')
            ->where('target_type', 'stories')
            ->groupBy('target_id')
            ->orderBy('clicks', 'DESC')
            ->get()
            ->map(function ($t) {
                $story = Story::find($t->target_id);
                if(empty($story) || $story->status !== 'published' ){
                    return null;
                }
                $tags = !empty($story) ? $story->tags->map(function ($t) {
                    $t->isCategory = strpos($t->name, 'category:') === 0;
                    unset($t->pivot);
                    return $t;
                }) : [];
                if (count($tags) > 0) {
                    return $tags;
                }
            })
            ->filter(function ($t) {
                return !empty($t);
            })
            ->flatten()
            ->unique('id')
            ->flatten();
    }

    /**
     * When no user or device_session_id then most famous tags will be chosen
     * @param null $user_id
     * @param null $dev_session_id
     * @return mixed
     */
    public function getTagsBasedOnUserReadings($user_id = null, $dev_session_id = null)
    {
        $tracks = DB::table('tracks')
            ->select(DB::raw('target_id, count(target_id) as clicks, SUM(duration) as read_time'))
            ->where('name', 'read@story')
            ->where('target_type', 'stories');

        if (!empty($user_id)) {
            $tracks = $tracks->where('user_id', $user_id)
                ->groupBy('target_id')
                ->orderBy('clicks', 'DESC')
                ->get();
        } else if (!empty($dev_session_id)) {
            $tracks = $tracks->where('device_session_id', $dev_session_id)
                ->groupBy('target_id')
                ->orderBy('clicks', 'DESC')
                ->get();
        } else {
            $tracks = $tracks->groupBy('target_id')
                ->orderBy('clicks', 'DESC')
                ->get();
        }

        $tags = $tracks
            ->map(function ($t) {
                $story = Story::find($t->target_id);
                if (!empty($story)) {
                    return $story->tags;
                }
            })
            ->filter(function ($t) {
                return !empty($t);
            })
            ->flatten();

        return $tags
            ->map(function ($t) use ($tags) {
                unset($t->pivot);
                $t->count = $tags->where('id', $t->id)->count();
                return $t;
            })
            ->unique('id')
            ->sortByDesc('count')
            ->flatten();
    }

    public function userHasAlreadyRead($story_id, $duration = 1000, $user_id = null, $dev_session_id = null)
    {
        $readTime = $this->getUserReadTime($story_id, $user_id = null, $dev_session_id = null);
        return $readTime > $duration;
    }

    public function getContinueReadingSuggestion($user_id = null, $dev_session_id = null)
    {
        if (empty($user_id) && empty($dev_session_id)) {
            return [];
        }
        $tracks = DB::table('tracks')
            ->select(DB::raw('target_id, count(target_id) as clicks, SUM(duration) as read_time'))
            ->where('name', 'read@story')
            ->where('target_type', 'stories');
        if (!empty($user_id)) {
            $tracks = $tracks->where('user_id', $user_id)
                ->groupBy('target_id')
                ->orderBy('read_time', 'DESC');
        } else {
            $tracks = $tracks->where('device_session_id', $dev_session_id)
                ->groupBy('target_id')
                ->orderBy('read_time');
        }

        return $tracks
            ->get()
            ->filter(function ($t) {
                return !empty($t->story) && $t->read_time >= 5000 && $t->read_time <= 35000;
            })->map(function ($t) use ($user_id, $dev_session_id) {
                $t->story = Story::find($t->target_id);
                $t->story->user_read_time = $this->getUserReadTime($t->target_id, $user_id, $dev_session_id);
                $this->setStoryForItem($t);
                return $t->story;
            })
            ->filter(function ($s) use ($user_id) {
                /*
                 * Don't suggest stories owned by the user**/
                return $s->type === 'blog' && empty($user_id) || $s->user_id !== $user_id;
            })
            ->flatten();
    }

    public function getUserReadTime($story_id, $user_id = null, $dev_session_id = null)
    {
        $tracks = DB::table('tracks')
            ->select(DB::raw('target_id, count(target_id) as clicks, SUM(duration) as read_time'))
            ->where('name', 'read@story')
            ->where('target_type', 'stories')
            ->where('target_id', $story_id);
        if (empty($user_id) && empty($dev_session_id)) {
            return 0;
        }
        if (!empty($user_id)) {
            $tracks = $tracks->where('user_id', $user_id)
                ->groupBy('target_id')
                ->orderBy('read_time', 'DESC');
        } else if (!empty($dev_session_id)) {
            $tracks = $tracks->where('device_session_id', $dev_session_id)
                ->groupBy('target_id')
                ->orderBy('read_time', 'DESC');
        }
        return $tracks->get()->count() > 0 ? $tracks->first()->read_time : 0;
    }

    public function getTagIdsBasedOnUserReadings($user_id = null, $dev_session_id = null)
    {
        $tags = $this->getTagsBasedOnUserReadings($user_id, $dev_session_id);
        if (empty($tags)) {
            return [];
        }
        return $tags->map(function ($t) {
            return $t->id;
        });
    }

    public function setStoryForItem($item)
    {
        if (empty($item)) {
            return;
        }
        $item->story;
        if (empty($item->story)) {
            return;
        }
        $item->story->reactions;
        $item->story->comments;
        $item->story->comments_count = $item->story->comments->count();
        $item->story->user;
        $item->story->tags;
        if (method_exists($this, 'getImageList')) {
            $item->story->images = $this->getImageList($item->story->id);
        }
        unset($item->story->comments);
        unset($item->story->content);
        unset($item->story->user->email);
        unset($item->story->user->phone);
        foreach ($item->story->reactions as $r) {
            $r->type;
            $r->name = $r->type->name;
            unset($r->type);
        }
        foreach ($item->story->tags as $t) {
            unset($t->pivot);
        }
    }
}