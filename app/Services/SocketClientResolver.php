<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/16/18
 * Time: 2:30 PM
 */

namespace App\Services;


use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use App\Exchange;
use App\ApiToken;
use App\Jobs\SocketClientCleanup;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Mockery\Exception;
use Illuminate\Support\Carbon;

class SocketClientResolver
{
    use DispatchesJobs;

    private $timestampId;

    function __construct()
    {
        $this->timestampId = 'last-socket-token-cleanup';
    }

    public function cleanup()
    {
        $lastCheck = $this->getLastCallAsCarbonDate();

        if (!empty($lastCheck) && Carbon::now()->diffInMinutes($lastCheck) < 30) {
            return;
        }
        Redis::set($this->timestampId, json_encode(Carbon::now()));
        $this->dispatch(new SocketClientCleanup());
    }

    private function getLastCallAsCarbonDate()
    {
        $lastTime = json_decode(Redis::get($this->timestampId));
        $lastCarbonTime = null;
        if (!empty($lastTime)) {
            try {
                if(is_object($lastTime) && property_exists($lastTime,'date')){
                    $lastCarbonTime = Carbon::parse($lastTime->date);
                }else if(is_array($lastTime) && array_key_exists('date', $lastTime)){
                    $lastCarbonTime = Carbon::parse($lastTime['date']);
                }
            } catch (Exception $e) {

            }
        }
        return $lastCarbonTime;
    }

    public function findForUser($userId)
    {
        if (empty($userId)) {
            return [];
        }
        $this->cleanup();
        /**
         * This logic requires that the apiToken->id is available as string.
         * Make sure the model is configured to cast the id as string.
         * Read more in ApiToken class!
         */
        return ApiToken::where('user_id', $userId)
            ->where('revoked', false)
            ->get()
            ->map(function ($nxt) {
                return Exchange::where('value', $nxt->id)
                    ->where('type', 'socket_token')
                    ->get()
                    ->map(function ($nxtExc) {
                        return $nxtExc->key;
                    });
            })
            ->flatten()
            ->unique()
            ->flatten()
            ->toArray();
    }

    public function findAll()
    {
        $this->cleanup();
        return ApiToken::where('revoked', false)
            ->get()
            ->map(function ($nxt) {
                return Exchange::where('value', $nxt->id)
                    ->where('type', 'socket_token')->get()->map(function ($nxtExc) {
                        return $nxtExc->key;
                    });
            })
            ->flatten()
            ->unique()
            ->flatten()
            ->toArray();
    }

}