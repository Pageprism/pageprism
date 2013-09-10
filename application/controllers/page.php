<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Page extends CI_Controller {

	function __construct()
	{
		parent::__construct();
	}

	public function index() {
		redirect("/");
	}

	public function view() {
		$this->layout->show('page', array('page_name' => $this->uri->segment(2)));
	}

}

/* End of file page.php */
/* Location: ./application/controllers/page.php */