<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class index extends MY_Controller {

	function __construct()
	{
		parent::__construct();
		$this->layout = New Layout();
	}

	function index()
	{
		$this->layout->show('admin/index');
	}

}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */