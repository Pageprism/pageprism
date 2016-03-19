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
    $this->load->model('book_model');
    $shelf_id = $this->uri->segment(2);
    $this->layout->show('index', array(
      'shelf_editable' => $this->session->userdata('logged_in'),
      'shelf_id' => $shelf_id,
      'shelf' => $this->book_model->loadShelf($shelf_id),
    ));
	}
	public function aggregate() {
    $this->load->model('book_model');
    $aggregate_key = $this->uri->rsegment(3);
    $aggregate_value = rawurldecode($this->uri->rsegment(4));

    $this->layout->show('index', array(
      'shelf_editable' => false,
      'shelf_id' => 0,
      'shelf' => $this->book_model->loadAggregateShelf($aggregate_key, $aggregate_value),
    ));
	}

	public function getMenu() {
    $book_id = $this->uri->segment(2);
    $this->load->view('menu', array('menu' => $this->Menu_model->getMenu()));
	}

}

/* End of file welcome.php */
/* Location: ./application/controllers/shelf.php */
