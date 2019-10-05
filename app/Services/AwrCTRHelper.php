<?php


namespace App\Services;

use Illuminate\Http\Request;
use Mockery\Exception;


class AwrCTRHelper
{

    public function getDefaultListOrderRules()
    {
        return (object)[
            'order' => false,
            'isDesc' => false,
            'orderKey' => 'created_at'
        ];
    }

    public function defaultCreateOne(Request $request, $clz, $isRelatedToAuthUser = false)
    {
        $item = new $clz();
        $item->fill($request->all());
        if ($isRelatedToAuthUser) {
            try {
                $user = $request->user();
                $item->user_id = $user->id;
            } catch (Exception $e) {

            }
        }
        $item->save();
        return $item;
    }


    public function listAll(Request $request, $model, $orderRules, $key = null, $value = null)
    {
        $init = false;
        $take = $request->query('take');
        $skip = $request->query('skip');
        if (is_array($key)) {
            $param_set = $this->pickParamsSet($request, $key);
            foreach ($param_set as $p) {
                $k = $p['key'];
                $v = $p['value'];
                if (!$init && !empty($v)) {
                    $model = $model::where($k, $v);
                    $init = true;
                } else if (!empty($v)) {
                    $model = $model->where($k, $v);
                }
            }
            if (!$init) {
                $list = $this->getList($model, $orderRules, true);
            } else {
                $list = $this->getList($model, $orderRules, false);
            }

        } else if (!empty($key)) {
            $list = $this->getList($model::where($key, $value), $orderRules, false);
        } else {
            $list = $this->getList($model, $orderRules, true);
        }
        if (!empty($skip) && is_numeric($skip) && $skip >= 0) {
            $list = $list->slice($skip);
        }
        if (!empty($take) && is_numeric($take) && $take >= 0) {
            $list = $list->take($take);
        }
        return $list->flatten();
    }

    /**
     * Note: Be careful with init. init === false means that the model instance
     * includes some applied queries on it. Init === true is again equal
     * to taking the list through all or get directly
     * from $this->getModel() and skipping the first arg ($model)
     *
     * @param $model
     * @param $orderRules
     * @param bool $init
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    private function getList($model, $orderRules, $init = false)
    {
        /*init==true means it is safe to use (should be used) CTR->getModel() with its static methods */
        if ($orderRules->order && $init) {
            return $model::orderBy($orderRules->orderKey, $orderRules->isDesc ? 'DESC' : 'ASC')->get();
        } else if ($orderRules->order) {
            return $model->orderBy($orderRules->orderKey, $orderRules->isDesc ? 'DESC' : 'ASC')->get();
        } else {
            return $init ? $model::all() : $model->get();
        }

    }

    private function pickParamsSet(Request $request, $set)
    {
        $param_set = array();
        /*
         * If the $set is normal array the values will be treated as key
         * and actual values will be taken from request's query otherwise
         * the key value will be picked from the $set
         * example:
         *
         *  +  ['target_type','name'] items as keys, and values from $request->query
         *  +  ['user_id'=>1] user_id as key and value 1, no query string search will be performed
         * **/
        foreach ($set as $key => $value) {
            $param_set[] = [
                'key' => is_numeric($key) ? $value : $key,
                'value' => is_numeric($key) ? $request->query($value) : $value
            ];
        }
        return $param_set;
    }
}