<?php
/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5/14/18
 * Time: 6:25 PM
 */

namespace App\Contracts;

use Illuminate\Http\Request;


interface AwrRestfulController extends AwrRestfulResource
{

    /**
     * If true, this means that the model has a user_id foreign key.
     * In such case the createOne function will set the user_id field
     * from $request get user!
     *
     * Default value is false.
     *
     * @return bool
     */
    public function isModelRelatedToAuthenticatedUser();

    /**
     * @return Model
     */
    public function getModel();

    /**
     * This function will be performed on each result!
     * @param $res
     */
    public function onResult($res);

    /**
     * This function is used for listing all resources.
     * @param Request $request . The key value allows the generic impl to limit
     * the search using 'where'.
     * @param $key | array
     * @param $value
     * @return mixed
     */
    public function listAll(Request $request, $key = null, $value = null);

    /**
     * Config object which decides what kind of ordering rules
     * should be applied on the set retrieved through listAll
     * @return object
     */
    public function getListOrderRules();

    /**
     * This function is used for finding resource by its id.
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function findOne(Request $request, $id);

    /**
     * Create one resource instance by calling fill with request.all()
     * @param Request $request
     * @return mixed
     */
    public function createOne(Request $request);

    /**
     * Update one resource instance by calling fill with request.all()
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function updateOne(Request $request, $id);

    /**
     * Remove one resource instance
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function removeOne(Request $request, $id);

    /**
     * This validator is used for creating a resource.
     * @param Request $request
     * @return mixed
     */
    public function createValidator(Request $request);

    /**
     * This validator is used for updating the resources.
     * @param Request $request
     * @return mixed
     */
    public function updateValidator(Request $request);

    /**
     * @param Request $request
     * @param $err
     */
    public function onCreateError(Request $request, $err);

    /**
     * @param Request $request
     * @param $err
     */
    public function onUpdateError(Request $request, $err, $id);

    /**
     * @param Request $request
     * @param $err
     */
    public function onRemoveError(Request $request, $err, $id);

    /**
     * @param Request $request
     * @return boolean
     */
    public function additionalCreateCheck(Request $request);

    /**
     * @param Request $request
     * @return boolean
     */
    public function additionalUpdateCheck(Request $request, $id);

    /**
     * @param Request $request
     * @return boolean
     */
    public function additionalRemoveCheck(Request $request, $id);

}