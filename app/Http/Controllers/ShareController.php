<?php

namespace App\Http\Controllers;

use App\Services\ExternalPreviewConfigBuilder;
use Illuminate\Http\Request;
use App\Story;
use App\User;
use App\Traits\StoryImages;
use App\Traits\CTRUtils;
use App\Traits\BlogIndexUtils;
use Illuminate\Support\Facades\Hash;
use App\Entities\ReferredLink;


class ShareController extends Controller
{
    use StoryImages, CTRUtils, BlogIndexUtils;


    /**
     * @var ExternalPreviewConfigBuilder
     */
    protected $configBuilder;

    /**
     * ShareController constructor.
     * @param ExternalPreviewConfigBuilder $configBuilder
     */
    public function __construct(ExternalPreviewConfigBuilder $configBuilder)
    {
        $this->configBuilder = $configBuilder;
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function refer(Request $request)
    {
        $data = $request->all();
        $referred = new ReferredLink($data['url']);
        $referred->fetch();
        return response()->json($referred, 200);
    }

    /**
     * @param Request $request
     * @param $key
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show(Request $request, $key)
    {
        $appGroup = Hash::make(env('AWR_ORIGINAL_APP_GROUP', 'default'));
        $dec = static::decodeItemShareId($key);
        $cnf = null;
        $item = null;
        if (!empty($dec) && $dec->prefix === 'story' && !empty($dec->id)) {
            $cnf = $this->configBuilder->makeStoryShareConfig($dec, $appGroup);
            $item = Story::find($dec->id);
        } else if (!empty($dec) && ($dec->prefix === 'home' || $dec->prefix === 'h')) {
            $cnf = $this->configBuilder->makeHomeSiteViewConfig($dec->id, $appGroup);
            $item = 'exists...';
        } else if (!empty($dec) && ($dec->prefix === 'profile' || $dec->prefix === 'p')) {

            $cnf = $this->configBuilder->makeProfileShareConfig($dec, $appGroup);
            $item = User::find($dec->id);
        }

        return is_null($cnf) || empty($item) ? view('errors.404') : view('share_link', $cnf);
    }

    /**
     * @param Request $request
     * @param $title
     * @param $key
     * @param string $pn
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function psShow(Request $request, $title, $key, $pn = 'index')
    {
        $appGroup = Hash::make(env('AWR_ORIGINAL_APP_GROUP', 'default'));
        $dec = static::decodeItemShareId($key);
        $cnf = $this->configBuilder->makePageConfig($dec, $appGroup, $pn);
//        return is_null($cnf) || empty($item) ? view('errors.404') : view('share_link', $cnf);
        return view('share_link', $cnf);
    }

}
