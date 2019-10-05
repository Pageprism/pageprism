<?php

namespace App\EmailData;

use App\Traits\CTRUtils;
use App\Story;

class StoryEmailNotifData
{
    use CTRUtils;


    public $article;

    public $category;

    public $author;

    public $server_root;

    public function __construct($storyId, $server_root)
    {
        $article = Story::find($storyId);
        $this->server_root = $server_root;
        if(empty($article)){
            return;
        }
        $article->share_link = $server_root . '/share/' . static::encodeItemShareId($article->id, 'story');
        $this->article = $article;
        $this->server_root = $server_root;
        $this->author = $article->user;
        $this->author->first_name = explode(' ', $this->author->name)[0];
        $this->author->picture = $server_root . $this->author->picture;
        foreach($article->tags as $tag){
            if(strpos($tag->name, 'category') === 0){
                $this->category = explode(':',$tag->name)[1];
            }
        }

    }


}