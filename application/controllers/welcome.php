<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Welcome extends CI_Controller {

	public function index()
  {
    $this->load->model('Shelf_model');
    $id = $this->Shelf_model->getFrontpageId();

    if ($id) {
      redirect('shelf/'.$id);
    } else {
      $this->load->view('header');
      $this->load->view('footer');
    }
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
