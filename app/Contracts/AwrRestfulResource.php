<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/14/18
 * Time: 6:25 PM
 */

namespace App\Contracts;

use Illuminate\Http\Request;


interface AwrRestfulResource
{

    /**
     * The HEAD request is almost identical to a GET request, they only differ
     * by a single fundamental aspect: the HEAD response should not include a payload (the actual data).
     *
     * This makes the HEAD HTTP verb fundamental for managing the validity of your current cached data.
     *
     * For now it allows the client to check the complete size
     * of items in db without actually requesting them.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response |
     */
    public function head(Request $request);

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response | array|\Illuminate\Database\Eloquent\Collection|static[]
     */
    public function index(Request $request);

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response | array
     */
    public function show(Request $request, $id);

    /**
     * Store a newly created resource in storage.
     *
     *
     * @param  Request $request
     * @return \Illuminate\Http\Response | array | object
     */
    public function store(Request $request);

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id);

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @param  Request $request
     * @return \Illuminate\Http\Response | array
     */
    public function destroy(Request $request, $id);

}