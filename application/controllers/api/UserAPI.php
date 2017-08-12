<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Restful API for User or more correctly (users) in current db
 */
class UserAPI extends CI_Controller
{

    function index()
    {

    }

    public function get()
    {
        $vars = $this->getProcVars();
        $res = $vars['response'];
        $model = $vars['model'];
        $this->load->model('book');
        $this->load->model('DocModel');
        $collection_id = $this->uri->segment(3);
        $status = 403;
        if (!empty($collection_id) && $model->findOne($collection_id)) {
            $res = $model->findOne($collection_id);
            if (!empty($res)) {
                $params = (object)[
                    'logged_in' => $this->session->userdata('logged_in'),
                    'resolution' => 300,
                    'models' => models_for_legacy_convert($this),
                    'docs' => $this->DocModel->findAllByOriginalCollection($collection_id),
                    'legacy_books' => $this->book->loadShelf($collection_id)
                ];
                $res[0]->docs = group_as_legacy($params);
            }
            $status = 200;

        } else {
            $res = $model->findAll();
            $status = 200;
        }
        $this->setJSONResponse($res, $status);
    }

    public function post()
    {
        $vars = $this->getProcVars();
        $req = $vars['request'];
        $res = $vars['response'];
        $model = $vars['model'];
        $status = 400;
        $res->message = "Bad request.";
        $featureInUse = false;
        if ($featureInUse && $this->hasProperties($req, ["name", "email", "pass"])) {
            $main_collection = property_exists($req, "main_collection") ? $req->main_collection : null;
            $newId = $model->create($req->name, $req->email, $req->pass, $main_collection);
            $res->user_id = $newId;
            if ($newId >= 0) {
                $status = 202;
                $res->message = "User Account created successfully.";
            }
        }
        if(!$featureInUse){
            $res->message = "Creating user account currently is not possible through API.";
        }
        $this->setJSONResponse($res, $status);
    }

    public function delete()
    {
        $vars = $this->getProcVars();
        $req = $vars['request'];
        $res = $vars['response'];
        $model = $vars['model'];
        $collection_id = $this->uri->segment(3);
        $status = 400;
        $res->message = "Bad request. User Account does not exist. Nothing to remove.";
        if (!empty($collection_id) && $model->remove($collection_id)) {
            $status = 202;
            $res->message = "User Account removed successfully.";
        }
        $this->setJSONResponse($res, $status);

    }

    public function put()
    {
        $vars = $this->getProcVars();
        $req = $vars['request'];
        $res = $vars['response'];
        $model = $vars['model'];
        $collection_id = $this->uri->segment(3);
        $status = 400;
        $res->message = "Bad request.";
        $collection = $model->findOne($collection_id);
        if (!empty($collection_id) && $collection) {
            //ignore pass edit for now, but later allow it with ["name", "email", "pass", "main_collection"];
            $keyValues = $this->getAndMergeProperties($req, $collection, ["name", "email", "main_collection"]);
            $res->message = "User account updated successfully [" . $model->update($collection_id, $keyValues) . "] ";
            $status = 202;
        }
        $this->setJSONResponse($res, $status);
    }

    private function hasProperties($req, $props)
    {
        if (!empty($req)) {
            foreach ($props as $p) {
                if (!property_exists($req, $p)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    private function getAndMergeProperties($req, $user, $props)
    {
        $keyValues = [];
        if (!empty($req)) {
            foreach ($props as $p) {
                if (property_exists($req, $p)) {
                    $keyValues[$p] = ((array)$req)[$p];
                } else if (!empty($user) && is_array($user) && count($user) > 0) {
                    if ($p !== 'pass') {
                        $keyValues[$p] = ((array)$user[0])[$p];
                    }
                }
            }
        }
        return $keyValues;
    }

    private function getProcVars()
    {
        $stream_clean = $this->security->xss_clean($this->input->raw_input_stream);
        $req = json_decode($stream_clean);
        $this->load->model('UserModel');
        $model = $this->UserModel;
        $res = new stdClass();
        return array(
            'request' => $req,
            'model' => $model,
            'response' => $res
        );
    }

    private function setJSONResponse($res = ['msg' => 'no data'], $status = 200)
    {
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($res,
                $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }
}
/* End of file upload.php */
/* Location: ./application/controllers/admin/upload.php */
