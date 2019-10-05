<?php

namespace App\Http\Controllers;

use App\Services\PSDocBodyDecorator;
use App\Services\StorySearchManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use \App\Story;
use \App\Tag;
use \App\Services\AutoCompleteManager;


class PSearchController extends Controller
{
    protected $autoCompleteManager;

    protected $storySearchManager;

    protected $docBodyDecorator;

    /**
     * PSearchController constructor.
     * @param AutoCompleteManager $autoCompleteManager
     * @param StorySearchManager $storySearchManager
     * @param PSDocBodyDecorator $docBodyDecorator
     */
    public function __construct(AutoCompleteManager $autoCompleteManager,
                                StorySearchManager $storySearchManager,
                                PSDocBodyDecorator $docBodyDecorator)
    {
        $this->autoCompleteManager = $autoCompleteManager;
        $this->storySearchManager = $storySearchManager;
        $this->docBodyDecorator = $docBodyDecorator;

    }

    public function autoComplete(Request $request)
    {
        $query = $request->query('query');

        $res = $this->autoCompleteManager->search($query, [
            'type' => $request->query('type'),
            'key' => $request->query('key')
        ]);

        return response()->json($res, 200);
    }

    public function storySearch(Request $request)
    {
        $query = $request->query('query');

        $res = $this->storySearchManager->search($query, [
            'type' => $request->query('type'),
            'key' => $request->query('key')
        ])->filter(function ($s) {
            if ($s->type === 'ps/doc') {
                $this->docBodyDecorator->decorate($s);
            }
            return $s->type === 'ps/doc';
        })->flatten();

        return response()->json($res, 200);
    }
}
