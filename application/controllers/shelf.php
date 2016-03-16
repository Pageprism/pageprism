<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Shelf extends CI_Controller {

	function __construct()
	{
		parent::__construct();
	}

	public function index() {
		redirect("/");
	}

	public function view() {
		$this->layout->show('index', array('shelf_id' => $this->uri->segment(2)));
	}

	public function getMenu() {
    $book_id = $this->uri->segment(2);
    $this->load->view('menu', array('menu' => $this->Menu_model->getMenu()));
	}

}

/* End of file welcome.php */
/* Location: ./application/controllers/shelf.php */
