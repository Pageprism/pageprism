<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Part of  Pageshare v1 and v2 server changes
 */

class Serial extends CI_Controller
{
    function __construct()
    {
        parent::__construct();
    }

    function index()
    {

    }

    public function list()
    {
        $proc = $this->getProcVars();
        $req = $proc['request'];
        $model = $proc['model'];
        $res = $proc['response'];

        $group = $req->group;
        if ($this->isUserAuthorized() && !empty($group)
        ) {
            $status = 200;
            $res = $model->findAllByGroup($group);

        } else {
            $status = 403;
            $res->msg = !$group ? 'Group required' : 'forbidden';
            $res->group = $group;
        }

        $this->setJSONResponse($res, $status);
    }

    public function find_one()
    {
        $proc = $this->getProcVars();
        $req = $proc['request'];
        $model = $proc['model'];
        $res = $proc['response'];

        $group = $req->group;
        $key = $req->key;
        if ($this->isUserAuthorized() && !(empty($group) || empty($key))) {
            $status = 200;
            $res = $model->findOneById($group, $key);

        } else {
            $status = 403;
            $res->msg = !$group ? 'Group required' : 'forbidden';
            $res->group = $group;
        }

        $this->setJSONResponse($res, $status);
    }

    public function push()
    {
        $proc = $this->getProcVars();
        $req = $proc['request'];
        $model = $proc['model'];
        $res = $proc['response'];

        $group = $req->group;
        $set = $req->set;
        if ($this->isUserAuthorized() && !empty($group)
        ) {
            $res->saved_count = $model->insertSet($set);
            $res->msg = 'insert authorized';
            $res->setForGroup = $model->findAllByGroup($group);
            $status = 202;

        } else {
            $status = 403;
            $res->msg = 'forbidden';
            $res->set = $set;
            $res->group = $group;
        }
        $this->setJSONResponse($res, $status);
    }

    public function update()
    {

        $proc = $this->getProcVars();
        $req = $proc['request'];
        $model = $proc['model'];
        $res = $proc['response'];

        $group = $req->group;
        $key = $req->key;
        $keyStatus = $req->keyStatus;
        if (($this->isUserAuthorized() || $keyStatus === "reserved-key") && !(empty($group) || empty($keyStatus) || empty($key))
        ) {
            $model->updateStatus($group, $key, $keyStatus);
            $res->msg = 'update authorized';
            $res->updated = $model->findOneById($group, $key);
            $status = 202;
        } else {
            $status = 403;
            $res->msg = 'forbidden';
            $res->group = $group;
        }
        $this->setJSONResponse($res, $status);

    }

    public function invalidate()
    {
        $proc = $this->getProcVars();
        $req = $proc['request'];
        $model = $proc['model'];
        $res = $proc['response'];

        $group = $req->group;
        $key = $req->key;
        if ($this->isUserAuthorized() && !(empty($group) || empty($key))
        ) {
            $model->updateStatus($group, $key, "expired-key");
            $res->msg = 'invalidate authorized';
            $res->updated = $model->findOneById($group, $key);
            $status = 202;

        } else {
            $status = 403;
            $res->msg = 'forbidden';
            $res->group = $group;
        }
        $this->setJSONResponse($res, $status);
    }


    private function setJSONResponse($res = ['msg' => 'no data'], $status = 200)
    {
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($res,
                $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    private function getProcVars()
    {

        $stream_clean = $this->security->xss_clean($this->input->raw_input_stream);
        $req = json_decode($stream_clean);
        $this->load->model('AwrSerialModel');
        $model = $this->AwrSerialModel;
        $res = new stdClass();
        return array(
            'request' => $req,
            'model' => $model,
            'response' => $res
        );
    }

    private function isUserAuthorized()
    {
        $user = $this->session->userdata();
        return $this->session->userdata('logged_in') != null &&
            $this->isAdmin($user['user_email']);
    }

    /**
     *
     * Quick and dirty hack: the is_admin hack is made in order to deliver client's urgent
     * requirement for having ability to produce invite keys.
     * Current version does not have any admin functionality neither
     * the current model recognize user roles at any level. The v2 will be for core parts about redesigning the model
     * around this problem. Until then some quick and dirty solution will provide some limited admin control.
     */
    private function isAdmin($email)
    {
        $admins_file = json_decode(file_get_contents('application/envs/users.json'));
        $admins = $admins_file->admin;
        foreach ($admins as $usr) {
            if ($usr->email === $email) {
                return true;
            }
        }
        return false;
    }
}

/* End of file auth.php */
/* Location: ./application/controllers/admin/auth.php */
