<?php

namespace App\Services;

use App\Entities\BasicPreviewAttributes;
use Illuminate\Http\Request;
use App\Story;
use App\User;
use App\Traits\StoryImages;
use App\Traits\CTRUtils;
use App\Traits\BlogIndexUtils;
use Illuminate\Support\Facades\Hash;
use Mockery\Exception;
use tests\Mockery\Adapter\Phpunit\EmptyTestCase;
use Log;

class ExternalPreviewConfigBuilder
{
    use StoryImages, CTRUtils, BlogIndexUtils;


    /**
     * @var BasicPreviewConfig
     */
    protected $basicConfig;

    protected $psDocDecorator;

    public function __construct(BasicPreviewConfig $basicConfig, PSDocBodyDecorator $psDocDecorator)
    {
        $this->basicConfig = $basicConfig;
        $this->psDocDecorator = $psDocDecorator;
    }


    public function makeHomeSiteViewConfig($viewId, $appGroup)
    {

        $server_root = static::getServerRoot();
        $defPreviewSrc = '/assets/img/awiar_logo_preview.png';
        $previewImage = ['src' => $defPreviewSrc];
        $title = 'Awiar Solutions, Web Development & Software Design';
        $description = 'Awiar Solutions is a company that believes in the innovation that can come from combining technology, talent and hard work."';
        $data = new \stdClass();
        $data->redirect_link = '/#';
        $path = base_path() . "/public/awr_home/index.json";

        if (file_exists($path)) {
            try {
                $indexJSON = json_decode(file_get_contents($path), true);
                if ($indexJSON && isset($indexJSON['previews']) &&
                    is_array($indexJSON['previews'])) {
                    $item = collect($indexJSON['previews'])->filter(function ($p) use ($viewId, $server_root) {
                        return ($p['view'] === $viewId || $p['view'] === $viewId . '-view');
                    })->first();

                    $title = $item['title'];
                    $description = $item['description'];
                    $previewImage['src'] = $item['image'];
                    $data->redirect_link = $server_root . '/#' . $item['spa_link'];
                    if (isset($item['image_width'])) {
                        $data->image_width = $item['image_width'];
                    }
                    if (isset($item['image_height'])) {
                        $data->image_height = $item['image_height'];
                    }
                }
            } catch (Exception $e) {

            }

        }
        $attrs = new BasicPreviewAttributes([
            'server_root' => $server_root,
            'appGroup' => $appGroup,
            'description' => $description,
            'previewImage' => $previewImage,
            'defPreviewSrc' => $defPreviewSrc,
            'title' => $title,
            'data' => $data
        ]);
        $cnf = $this->basicConfig->make($attrs);
        return $cnf;
    }

    /**
     * @param $dec
     * @param $appGroup
     * @return array
     */
    public function makeStoryShareConfig($dec, $appGroup): array
    {
        $story = null;
        $data = new \stdClass();
        $server_root = static::getServerRoot();
        $title = 'Shared links | Awiar Solutions';
        $defPreviewSrc = '/assets/img/read_logo_fullsize.png';
        $previewImage = ['src' => $defPreviewSrc];
        $data->redirect_link = '/read/#display/noStoryItemFound?v=index';

        $story = Story::find($dec->id);

        if (!empty($story)) {
            $this->setStoryForItem((object)['story' => $story]);
            $data->redirect_link = '/read/#display/' . static::encodeItemShareId($story->id) . '?v=index';
            $previewImage = static::getPreviewImage($story->images, $previewImage);
        }
        $title = !empty($story) && isset($story->title) ?
            $story->title . ' - Awiar Read' : $title;
        $summary = !empty($story) && isset($story->summary) ?
            substr($story->summary, 0, 260) . '...' : 'Read & Share ideas about everything!';
        $attrs = new BasicPreviewAttributes([
            'server_root' => $server_root,
            'appGroup' => $appGroup,
            'description' => $summary,
            'previewImage' => $previewImage,
            'defPreviewSrc' => $defPreviewSrc,
            'title' => $title,
            'data' => $data
        ]);
        $cnf = $this->basicConfig->make($attrs);
        return $cnf;
    }

    /**
     * @param $dec // decoded item id
     * @param $appGroup
     * @return array
     */
    public function makeProfileShareConfig($dec, $appGroup): array
    {
        $user = null;
        $data = new \stdClass();
        $server_root = static::getServerRoot();
        $title = 'Shared profile links | Awiar Profile';
        $defPreviewSrc = '/assets/profile_app/img/profile_logo_fullsize.png';
        $previewImage = ['src' => $defPreviewSrc];
        $data->redirect_link = '/profile/#index/noProfileFound?v=all&it_type=none&it_next=none&it=none';
        $user = User::find($dec->id);
        $name = 'User';
        if (!empty($user)) {
            $data->redirect_link = '/profile/#index/' . static::encodeItemShareId($user->id) . '?v=all&it_type=none&it_next=none&it=none';
            $previewImage['src'] = $user->picture;
            $name = ucwords($user->name);

        }
        $title = !empty($user) && isset($user->title) ?
            $name . ' | Awiar Profile' : $title;
        $summary = 'Follow and find out more about ' . $name . ' on Awiar Profile.';
        $attrs = new BasicPreviewAttributes([
            'server_root' => $server_root,
            'appGroup' => $appGroup,
            'description' => $summary,
            'previewImage' => $previewImage,
            'defPreviewSrc' => $defPreviewSrc,
            'title' => $title,
            'data' => $data
        ]);
        $cnf = $this->basicConfig->make($attrs);
        return $cnf;
    }

    /**
     * @param $dec
     * @param $appGroup
     * @param string $page
     * @return array
     */
    public function makePageConfig($dec, $appGroup, $page = 'index'): array
    {
        $data = new \stdClass();
        $server_root = static::getServerRoot();
        $doc = Story::find($dec->id);
        $this->psDocDecorator->decorate($doc);
        $title = static::getPropertyValue($doc, 'title', 'Shared links | Pageshare');
        $data->redirect_link = "$server_root/v/" . static::urlSafeTitleEncode($title) . "/" .
            static::encodeItemShareId($dec->id)."/$page?c=index";
        $cover = self::getPropertyValue($doc, 'cover', null);
        $summary = self::getPropertyValue($doc, 'summary', 'Read it in Pageshare');
        $defPreviewSrc = '/assets/ps/ps-logo.png';
        $previewImage = ['src' => !empty($cover->src) ? $cover->src : $defPreviewSrc];
        $attrs = new BasicPreviewAttributes([
            'server_root' => $server_root,
            'appGroup' => $appGroup,
            'description' => $summary,
            'previewImage' => $previewImage,
            'defPreviewSrc' => $defPreviewSrc,
            'title' => is_numeric($page) ? $title . " | Page $page" : $title,
            'data' => $data,
            'ux_resources' => 'pageshare_app',
            'layout_group' => 'ps'
        ]);
        $cnf = $this->basicConfig->make($attrs);
        return $cnf;
    }

}