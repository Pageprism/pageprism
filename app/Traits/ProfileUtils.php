<?php

namespace App\Traits;

use App\User;
use App\Story;
use App\Tag;
use App\CoverStory;
use Illuminate\Support\Facades\DB;
use App\Following;
use Illuminate\Http\Request;

trait ProfileUtils
{



    public function setupShortProfileResult($res)
    {
        if (empty($res)) {
            return;
        }
        $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $res->roles;
        $res->skills;
        $res->social_links = $res->socialLinks;
        $res->followers;
        $res->follows;
        $res->experiences;

        foreach ($res->skills as $s) {
            $s->tag;
            $s->name = $s->tag->name;
            unset($s->tag);
        }
        foreach ($res->followers as $f) {
            $pivot = Following::where('follower_id', $f->id)->where('followed_id', $res->id)->first();
            $f->pivot->id = $pivot->id;
            unset($f->email);
            unset($f->phone);
        }
        foreach ($res->follows as $f) {
            $pivot = Following::where('follower_id', $res->id)->where('followed_id', $f->id)->first();
            $f->pivot->id = $pivot->id;
            unset($f->email);
            unset($f->phone);
        }

        $res->share_link = $server_root . '/share/' . $this->encodeItemShareId($res->id, 'p:');

//        unset($res->email);
        unset($res->phone);
        unset($res->socialLinks);
    }

    public function setupProfileResult($res)
    {
        if (empty($res)) {
            return;
        }
        $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $res->roles;
        $res->skills;
        $res->social_links = $res->socialLinks;
        $res->followers;
        $res->follows;
        $res->experiences;
        $story = $res->profileStory();
        if (empty($story)) {
            $story = new Story();
            $story->fill([
                'user_id' => $res->id,
                'type' => 'profile_story',
                'content_type' => 'text',
                'title' => 'Profile story of ' . $res->name,
                'content' => '',
                'status' => 'published'
            ]);
            $story->save();
        }
        foreach ($res->skills as $s) {
            $s->tag;
            $s->name = $s->tag->name;
            unset($s->tag);
        }
        foreach ($res->followers as $f) {
            $pivot = Following::where('follower_id', $f->id)->where('followed_id', $res->id)->first();
            $f->pivot->id = $pivot->id;
            unset($f->email);
            unset($f->phone);
        }
        foreach ($res->follows as $f) {
            $pivot = Following::where('follower_id', $res->id)->where('followed_id', $f->id)->first();
            $f->pivot->id = $pivot->id;
            unset($f->email);
            unset($f->phone);
        }

        $res->profile_story = $story;
        $res->profile_reviews = $res->profileReviews();
        $res->profile_reactions = $res->profileReactions();
        $res->share_link = $server_root . '/share/' . $this->encodeItemShareId($res->id, 'p');
        $res->latest_shares = Story::where('user_id', $res->id)
            ->where('type', 'blog')
            ->where('status', 'published')
            ->orderBy('created_at', 'Desc')
            ->take(3)
            ->get()
            ->map(function ($s) {
                unset($s->content);
                $s->user;
                $s->reactions;
                foreach ($s->reactions as $r) {
                    $r->type;
                    $r->name = $r->type->name;
                    unset($r->type);
                }
                $s->comments;
                $s->comments_count = !empty($s->comments) ? count($s->comments) : 0;
                unset($s->comments);
                return $s;
            });

//        unset($res->email);
        unset($res->phone);
        unset($res->socialLinks);

        //$res->contact_replies;
        //$res->notifications;
    }


}