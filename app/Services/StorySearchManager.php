<?php


namespace App\Services;


use App\SettingKey;
use App\SettingValue;
use App\Story;
use App\StorySetting;
use App\User;
use App\Tag;
use App\MetaKey;
use App\MetaValue;
use App\StoryMeta;


class StorySearchManager
{

    /**
     * @param $query
     * @param array $limits
     * @param int $max
     * @return mixed
     */
    public function search($query, Array $limits = [], $max = 100)
    {
        if (empty($query)) {
            return collect([]);
        }

        if (!empty($limits['type']) && $limits['type'] === 'meta_key') {
            return $this->byMetaType($query, $limits['key'], $max);
        } else if (!empty($limits['type']) && $limits['type'] === 'tag') {
            return $this->byTag($query, $max);
        }

        return $this->all($query, $max);
    }


    private function byTag($query, $max = 100)
    {
        $tagRes = Tag::all()->filter(function ($t) use ($query) {
            return stripos(strtolower($t->name), strtolower($query)) !== false;
        })->map(function ($t) {
            return $t->stories;
        })->flatten();

        return $this->pack($tagRes, $query, $max);
    }

    private function byMetaType($query, $metaKey = null, $max = 100)
    {
        if (empty($metaKey)) {
            $metaRes = MetaValue::all()->filter(function ($t) use ($query) {
                return stripos(strtolower($t->value), strtolower($query)) !== false;
            })->map(function ($t) {
                return StoryMeta::where('meta_value_id', $t->id)
                    ->get()
                    ->map(function ($sm) {
                        return Story::find($sm->story_id);
                    });
            })->flatten();
            return $this->pack($metaRes, $query, $max);
        }
        $key = MetaKey::where('name', strtolower($metaKey))->first();
        if (empty($key)) {
            return collect([]);
        }
        if (strtolower($metaKey) === 'authors') {
            $userRes = User::all()->filter(function ($t) use ($query) {
                return stripos(strtolower($t->name), strtolower($query)) !== false;
            });

            $metaRes = MetaValue::where('meta_key_id', $key->id)->get()->filter(function ($t) use ($query) {
                return stripos(strtolower($t->value), strtolower($query)) !== false;
            })->map(function ($t) {
                return StoryMeta::where('meta_value_id', $t->id)
                    ->get()
                    ->map(function ($sm) {
                        return Story::find($sm->story_id);
                    });
            })->flatten();
            return $this->pack(collect($userRes->concat($metaRes)), $query, $max);
        }
        return $this->pack(MetaValue::where('meta_key_id', $key->id)->get()->filter(function ($t) use ($query) {
            return stripos(strtolower($t->value), strtolower($query)) !== false;
        })->map(function ($t) {
            return StoryMeta::where('meta_value_id', $t->id)
                ->get()
                ->map(function ($sm) {
                    return Story::find($sm->story_id);
                });
        })->flatten(), $query, $max);
    }

    private function all($query, $max = 100)
    {
        if (empty($query)) {
            return collect([]);
        }

        $tagRes = $this->byTag($query, $max);
        $metaRes = $this->byMetaType($query, null, $max);
        return $this->pack(collect($tagRes->concat($metaRes)), $query, $max);

    }

    private function pack($collection, $query, $max)
    {
        return $collection->flatten()
            ->filter(function ($s) {
                $allowKey = SettingKey::where('name', 'allow_aggregating')->first();
                if (empty($allowKey)) {
                    return $s->statues = 'published';
                }
                $allowValue = SettingValue::where('value', '1')->where('setting_key_id', $allowKey->id)->first();
                $allowed = !empty($allowValue) && StorySetting::where('story_id', $s->id)
                        ->where('setting_value_id', $allowValue->id)
                        ->get()->count() > 0;
                return $s->statues = 'published' && ($s->type !== 'ps/doc' || $allowed);
            })
            ->unique('id')
            ->take($max)
            ->flatten();
    }
}