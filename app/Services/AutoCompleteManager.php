<?php


namespace App\Services;


use App\User;
use App\Tag;
use App\MetaKey;
use App\MetaValue;


class AutoCompleteManager
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
        } else if (!empty($limits['type']) && $limits['type'] === 'user') {
            return $this->byUser($query, $max);
        }

        return $this->all($query, $max);
    }

    private function byUser($query, $max = 100)
    {
        $userRes = User::all()->filter(function ($t) use ($query) {
            return stripos(strtolower($t->name), strtolower($query)) !== false;
        })->map(function ($t) {
            return $t->name;
        });
        return $this->pack($userRes, $query, $max);
    }

    private function byTag($query, $max = 100)
    {
        $tagRes = Tag::all()->filter(function ($t) use ($query) {
            return stripos(strtolower($t->name), strtolower($query)) !== false;
        })->map(function ($t) {
            return $t->name;
        });
        return $this->pack($tagRes, $query, $max);
    }

    private function byMetaType($query, $metaKey = null, $max = 100)
    {
        if (empty($metaKey)) {
            $metaRes = MetaValue::all()->filter(function ($t) use ($query) {
                return stripos(strtolower($t->value), strtolower($query)) !== false;
            })->map(function ($t) {
                return $t->value;
            });
            return $this->pack($metaRes, $query, $max);
        }
        $key = MetaKey::where('name', strtolower($metaKey))->first();
        if (empty($key)) {
            return collect([]);
        }
        if (strtolower($metaKey) === 'authors') {
            $userRes = User::all()->filter(function ($t) use ($query) {
                return stripos(strtolower($t->name), strtolower($query)) !== false;
            })->map(function ($t) {
                return $t->name;
            });

            $metaRes = MetaValue::where('meta_key_id', $key->id)->get()->filter(function ($t) use ($query) {
                return stripos(strtolower($t->value), strtolower($query)) !== false;
            })->map(function ($t) {
                return $t->value;
            });
            return $this->pack(collect($userRes->concat($metaRes)), $query, $max);
        }
        return $this->pack(MetaValue::where('meta_key_id', $key->id)->get()->filter(function ($t) use ($query) {
            return stripos(strtolower($t->value), strtolower($query)) !== false;
        })->map(function ($t) {
            return $t->value;
        }), $query, $max);
    }

    private function all($query, $max = 100)
    {
        if (empty($query)) {
            return collect([]);
        }
        $tagRes = Tag::all()->filter(function ($t) use ($query) {
            return stripos(strtolower($t->name), strtolower($query)) !== false;
        })->map(function ($t) {
            return $t->name;
        });

        $metaRes = MetaValue::all()->filter(function ($t) use ($query) {
            return stripos(strtolower($t->value), strtolower($query)) !== false;
        })->map(function ($t) {
            return $t->value;
        });

        $userRes = User::all()->filter(function ($t) use ($query) {
            return stripos(strtolower($t->name), strtolower($query)) !== false;
        })->map(function ($t) {
            return $t->name;
        });

        return $this->pack(collect($tagRes->concat($metaRes)->concat($userRes)), $query, $max);

    }

    private function pack($collection, $query, $max)
    {
        return $collection->sortBy(function ($nxt) use ($query) {
            return stripos(strtolower($nxt), strtolower($query));
        })->flatten()->unique(function ($nxt) {
            /*this determine uniqueness in case insensitive manner*/
            return strtolower($nxt);
        })->take($max)->flatten();
    }
}