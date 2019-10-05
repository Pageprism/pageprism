<?php

namespace App\Entities;

use App\Traits\CTRUtils;
use App\Traits\BlogIndexUtils;
use App\Traits\ProfileUtils;
use App\Traits\StoryImages;
use Illuminate\Support\Facades\Cache;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use App\Story;
use App\User;
//use Symfony\;

class ReferredLink
{
    //
    use CTRUtils, BlogIndexUtils, ProfileUtils, StoryImages;

    private $story;

    private $client;

    public $url;

    public $fromCache;

    private $server_root;

    public $referKey;

    public $referDomain;

    public $referId;

    public $referType;

    public $referTarget;

    public $targetContentType;

    public $isExternal;

    public $isInternalItem;


    public function __construct($url)
    {
        $this->url = $url;
        $this->server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $this->parseURL();
        $this->client = $client = new Client();
    }

    public function fetch()
    {
        $this->fromCache = false;
        if ($this->referType == 'story') {
            $this->story = Story::where('status', 'published')->where('id', $this->referId)->first();
            $this->setStoryForItem($this);
            if(!empty($this->story)){
                $this->story->images = $this->getImageList($this->story->id);
            }
            $this->story->share_link = '/share/' . static::encodeItemShareId($this->story->id, 'story');
            $this->referTarget = $this->story;
        } else if ($this->referType == 'profile') {
            $this->referTarget = User::find($this->referId);
            if(!empty($this->referTarget)){
                $this->referTarget->share_link = '/share/' . static::encodeItemShareId($this->referTarget->id, 'profile');
            }
            $this->setupShortProfileResult($this->referTarget);
        } else if (!$this->isInternalItem) {
            if (Cache::has('refer:' . $this->url)) {
                $this->fromCache = true;
                $cached = Cache::get('refer:' . $this->url);
                $this->referTarget = $cached['target'];
                $this->targetContentType = $cached['contentType'];
                return;
            }

            $res = $this->client->request('GET', $this->url);
            $this->targetContentType = $res->getHeaderLine('Content-Type');
            if(strpos($this->targetContentType, 'text/html') >= 0){
                $this->referTarget = $this->parseExternalTarget($res->getBody()->getContents());
            }else{
                $this->referTarget = null;
            }
            $cacheTime = now()->addMinutes(45);
            if(env('APP_ENV') === 'production'){
                $cacheTime =  now()->addHours(48);
            }else if(env('APP_ENV') === 'development'){
                $cacheTime = now()->addHours(1);
            }
            Cache::put('refer:' . $this->url, [
                'contentType' => $this->targetContentType,
                'target' => $this->referTarget
            ], $cacheTime);
        }
    }
    private function parseExternalTarget($html_str){
        $crawler = new Crawler($html_str);
        $t = [];
        //read more about Symfony dom crawler and XPath: http://symfony.com/doc/3.4/components/dom_crawler.html
        foreach ($crawler->filterXPath('//head/title') as $domElement) {
            $t[] = ['name' => 'html:title', 'content' => $domElement->textContent];
        }
        foreach ($crawler->filterXPath('//head/meta') as $domElement) {
            $name = $domElement->getAttribute('name');
            $property = $domElement->getAttribute('property');
            if (!empty($name)) {
                $t[] = ['name' => $name, 'content' => $domElement->getAttribute('content')];
            } else if (!empty($property)) {
                $t[] = ['property' => $property, 'content' => $domElement->getAttribute('content')];
            }
        }
        return $t;
    }

    private function parseURL()
    {
        if (empty($this->url)) {
            return;
        }
        $this->isExternal = !($this->startsWith($this->url, $this->server_root) ||
            $this->startsWith($this->url, 'http://localhost'));
        $this->isInternalItem = false;
        if (!$this->isExternal) {
            $this->referKey = $this->pickShareKeyFromURL($this->url, $this->server_root);
            $decoded = $this->decodeItemShareId($this->referKey);
            $this->referId = $decoded->id;
            $this->referType = $decoded->prefix == 'story' || $decoded->prefix == 's' ? 'story' : 'unknown';
            $this->referType = $decoded->prefix == 'profile' || $decoded->prefix == 'p' ? 'profile' : $this->referType;
            $this->isInternalItem = $this->referType == 'profile' || $this->referType == 'story';
        }
        $this->referDomain = $this->getReferDomain($this->url);

    }

    private function getReferDomain($url)
    {
        $protocol = '';
        if (empty($url)) {
            return null;
        }
        if ($this->startsWith($url, 'https://')) {
            $protocol = 'https://';
        } else if ($this->startsWith($url, 'http://')) {
            $protocol = 'http://';
        } else if ($this->startsWith($url, 'git://')) {
            $protocol = 'git://';
        } else if ($this->startsWith($url, '://')) {
            $protocol = '://';
        } else if ($this->startsWith($url, '//')) {
            $protocol = '//';
        }
        return collect(explode($protocol, $url))
            ->filter(function ($p) {
                return !empty($p);
            })
            ->map(function ($p) {
                return collect(explode('/', $p))->filter(function ($s) {
                    return !empty($s);
                })->first();
            })->first();

    }

    private function pickShareKeyFromURL($url, $server_root)
    {

        return empty($url) ? '' : collect(explode($this->startsWith($url, 'http://localhost') ?
            'http://localhost' : $server_root, $url))
            ->filter(function ($p) {
                return !empty($p);
            })->flatten()
            ->map(function ($p) {
                return collect(explode('/share/', $p))->filter(function ($i) {
                    return !empty($i);
                })->first();
            })->first();
    }

}
