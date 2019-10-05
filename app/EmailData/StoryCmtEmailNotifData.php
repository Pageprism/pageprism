<?php

namespace App\EmailData;

use App\Traits\CTRUtils;
use App\Story;
use App\Comment;

class StoryCmtEmailNotifData
{
    use CTRUtils;


    public $article;

    public $category;

    public $author;

    public $receiver;

    public $commenter;

    public $isForAuthor;

    public $server_root;

    public $unsubscribeLink;

    public function __construct($user, $storyId, $cmtId, $isForAuthor, $server_root)
    {
        $article = Story::find($storyId);
        $comment = Comment::find($cmtId);
        $this->server_root = $server_root;
        if (empty($article) || empty($comment)) {
            return;
        }
        $article->share_link = $server_root . '/share/' . static::encodeItemShareId($article->id, 'story');
        $this->isForAuthor = $isForAuthor;
        $this->article = $article;
        $this->server_root = $server_root;
        $this->author = $article->user;
        $this->author->first_name = explode(' ', $this->author->name)[0];
        $this->author->picture = $server_root . $this->author->picture;
        $this->receiver = $user;
        $this->commenter = $comment->user;
        $this->commenter->first_name = explode(' ', $this->commenter->name)[0];
        $this->commenter->picture = $server_root . $this->commenter->picture;
        $this->unsubscribeLink = $server_root . '/unsubscribe/' .
            $this->encodeItemShareId($user->id, 'user') . '/' .
            $this->encodeItemShareId('story-notifs', 'name') . '/' .
            $this->encodeItemShareId($storyId, 'story');

        foreach ($article->tags as $tag) {
            if (strpos($tag->name, 'category') === 0) {
                $this->category = explode(':', $tag->name)[1];
            }
        }

    }


}