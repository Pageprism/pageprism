<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

Class MY_Controller extends CI_Controller {
    public function __construct()
    {
        parent::__construct();
		$this->load->library("SimpleLoginSecure");
		if ($this->session->userdata("logged_in") == false)
		{
			echo "Error: not logged in";
		}
    }
}
 /* End of file MY_Controller.php */