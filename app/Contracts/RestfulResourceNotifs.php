<?php
/**
 * User: kavan
 * Date: 5/14/18
 * Time: 6:25 PM
 */

namespace App\Contracts;

use Illuminate\Http\Request;

interface RestfulResourceNotifs
{

    public function notifyBeforeCreate(Request $request);

    public function notifyCreate(Request $request, $resource);

    public function notifyBeforeUpdate(Request $request, $resource);

    public function notifyUpdate(Request $request, $resource);

    public function notifyBeforeRemove(Request $request, $resource);

    public function notifyRemove(Request $request, $resource);

    public function notifyList(Request $request, $resource);

    public function notifyFindOne(Request $request, $resource);

}