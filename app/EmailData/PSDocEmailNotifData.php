<?php

namespace App\EmailData;

use App\Traits\CTRUtils;
use App\Services\PSDocBodyDecorator;
use App\Story;
use Log;

class PSDocEmailNotifData
{
    use CTRUtils;


    protected $psDocBodyDecorator;

    public $book;

    public $authors;

    public $category;

    public $uploader;

    public $book_link;

    public $server_root;

    public function __construct($storyId, $server_root)
    {
        $this->psDocBodyDecorator = new PSDocBodyDecorator();
        $book = Story::find($storyId);
        $this->server_root = $server_root;
        if (empty($book)) {
            return;
        }
        $book->share_link = $server_root . '/share/' . static::encodeItemShareId($book->id, 'story');
        $this->book = $book;
        $this->psDocBodyDecorator->decorate($this->book);
        $this->cover_image = !empty($this->book->cover) ? $this->book->cover->src : '';
        $this->server_root = $server_root;
        $this->uploader = $book->user;
        $this->uploader->first_name = explode(' ', $this->uploader->name)[0];
        $this->uploader->picture = $server_root . $this->uploader->picture;
        $this->book_link = $server_root . '/#v/' . static::urlSafeTitleEncode($book->title) . '/'
            . static::encodeItemShareId($book->id) . '/index?c=index';
        $this->authors = [];

        if (!empty($this->book->meta)) {
            $this->book->meta->each(function ($m) {
                if ($m->key === 'authors') {
                    $this->authors[] = $m->value;
                }
            });
        }

        if (empty($this->authors)) {
            $this->authors[] = '...';
        }

        foreach ($book->tags as $tag) {
            if (strpos($tag->name, 'category') === 0) {
                $this->category = explode(':', $tag->name)[1];
            }
        }

    }



}