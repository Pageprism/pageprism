<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/16/18
 * Time: 3:11 PM
 */

namespace App\Jobs;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Bus\Queueable;
use App\Exchange;
use App\ApiToken;

class SocketClientCleanup implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $exchanges = ApiToken::where('revoked', 1)
            ->get()
            ->map(function($nxt){return Exchange::where('value', $nxt->id)->get();})
            ->unique()
            ->flatten();
        $exchanges->each(function($nxt){
            $model = Exchange::find($nxt->id);
            if(!empty($model)){
                $model->delete();
            }
        });

    }
}