<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class Auth
 * from legacy code. However, refactored to match
 * new system structure. Refactor and remove after
 * clean decencies to here.
 */

class Auth extends CI_Controller
{
    function __construct()
    {
        parent::__construct();
    }

    function index()
    {

    }

    function active_user()
    {
        $this->load->model('AwrSerialModel');
        $res = new stdClass();
        if ($this->session->userdata('logged_in') != null) {
            $status = 200;
            $res = $this->session->userdata();
            $res['is_admin'] = $this->isAdmin($res['user_email']);
            $res['key'] = null;
        } else {
            $status = 404;
            $res->logged_in = false;
        }
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($res,
                $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    function active_login()
    {
        $user = $this->input->post('user');
        $password = $this->input->post('password');
        $res = new stdClass();
        if ($user && $password) {
             if ($this->simpleloginsecure->login($user, $password)) {
                $status = 202;
                $res->status = "success";
                $res->message = "login successful";
                $res->user = $this->session->userdata();
                $res->user["is_admin"] = $this->isAdmin($res->user['user_email']);
                 $res->key = null;
            } else {
                $status = 401;
                $res->status = "failed";
                $res->error = "Wrong username or password";
            }
        } else {
            $status = 401;
            $res->status = "failed";
            $res->error = "User or password empty";
        }
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($res,
                $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    function find_user()
    {
        $email = $this->input->post('email');
        $res = new stdClass();
        if ($email) {
            if ($this->simpleloginsecure->userExist($email)) {
                $status = 200;
                $res->status = "Found.";
                $res->user = $this->simpleloginsecure->userInfo($email);
            } else {
                $status = 404;
                $res->status = "Not found.";
                $res->message = "No user found with given email.";
            }

        } else {
            $status = 401;
            $res->status = "Not found.";
            $res->message = "Please specify a valid email address.";

        }

        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($res,
                $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    function signup()
    {

        $first_name = $this->input->post('first_name');
        $last_name = $this->input->post('last_name');
        $email = $this->input->post('email');
        $password = $this->input->post('password');
        $registrationKey = $this->input->post('registrationKey');

        $res = new stdClass();
        if ($this->hasValidRegistrationKey($registrationKey) &&
            $first_name && $last_name && $email && $password
        ) {
            $full_name = $first_name . ' ' . $last_name;
            if ($this->simpleloginsecure->userExist($email)) {
                $status = 403;
                $res->status = "failed";
                $res->signup_msg = "email in use";
                $res->error = "User registration failed. Email is already in use." .
                    "Please try different email, a user with this email address" .
                    " is already registered.";
                $res->data = [
                    "email" => $email
                ];
            } else if ($this->simpleloginsecure->create($email, $password, $full_name, true)) {
                $this->useRegistrationKey($registrationKey);
                $status = 202;
                $res->status = "success";
                $res->signup_msg = "ok";
                $res->message = "New user registered successfully";
                $res->user = $this->session->userdata();
            } else {
                $status = 400;
                $res->status = "failed";
                $res->error = "User registration failed.";

            }
        } else {
            $status = 400;
            $res->status = "failed";
            $res->signup_msg = "required fields missing";
            $res->error = "User registration failed. " .
                "Missing or invalid required data.";
            $res->data = [
                "first_name" => $first_name,
                "last_name" => $last_name,
                "email" => $email,
                "password" => $password
            ];
            if (!$this->hasValidRegistrationKey($registrationKey)) {
                $status = 403;
                $res->signup_msg = "Expired registration key.";
            }
        }
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($res,
                $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    function logout()
    {
        $this->simpleloginsecure->logout();
        $status = 200;
        $res = new stdClass();
        $res->msg = "You have logged out";
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($res,
                $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    private function hasValidRegistrationKey($key)
    {
        $this->load->model('AwrSerialModel');
        return !$this->AwrSerialModel->isKeyExpired("registration", $key);
    }

    private function useRegistrationKey($key)
    {
        $this->load->model('AwrSerialModel');
        return !$this->AwrSerialModel->updateStatus("registration", $key, "expired-key");
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
