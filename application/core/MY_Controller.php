<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class MY_Controller extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		if ($this->session->userdata('logged_in') == null)
		{
			//$login_page= $this->load->view('admin/auth',"",true);
      //exit($login_page);
      $current_url = $_SERVER['REQUEST_URI'];
			redirect('admin/auth?backUrl='.urlencode($current_url));
		}
	}

}

/* End of file MY_Controller.php */
