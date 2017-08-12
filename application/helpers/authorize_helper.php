<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * A temporary solution for manage requests that require authorization. In the next major version pump
 * a proper design should replace this temporary mechanism for authorizing requests.
 */

if (!function_exists('require_login')) {
    function require_login($is_ajax = false, $controller)
    {
        if (empty($controller)) {
            return;
        }
        $session = $controller->session;
        $output = $controller->output;
        if ($session->userdata('logged_in') == null && !$is_ajax) {
            //$login_page= $this->load->view('admin/auth',"",true);
            //exit($login_page);
            $current_url = $_SERVER['REQUEST_URI'];
            redirect('admin/auth?backUrl=' . urlencode($current_url));
            return false;
        } else if ($session->userdata('logged_in') == null
            && $is_ajax
        ) {
            $res = (object)[
                "status" => "Unauthorized",
                "error" => "login is required for this action"
            ];
            $output
                ->set_status_header(401)
                ->set_content_type('application/json')
                ->set_output(json_encode($res,
                    $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
            return false;
        }
        return true;
    }
}

if (!function_exists('get_awr_implementor')) {
    function get_awr_implementor(CI_Controller $ci_instance)
    {
        return new class($ci_instance) extends awr\GenericCIFlowUnderlayVariablesImplementor
            implements awr\BasicFlowUnderlayVariables
        {
            function __construct(CI_Controller $ci_instance)
            {
                parent::__construct($ci_instance);
            }
        };
    }
}
