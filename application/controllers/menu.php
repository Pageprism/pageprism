<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Menu extends CI_Controller {

	public function load_menu() {
    $book_id = $this->input->post('book');

    if ($book_id) {
      $this->load->model('book_model');
      $book = $this->book_model->loadBook($book_id);
      if ($book) {
        $uri = '/'.$book->book_name_clean;
        $this->load->view('menu', array('menu' => $this->Menu_model->getMenu($book, $uri)));
        return;
      }
    }

    $this->load->view('menu', array('menu' => $this->Menu_model->getMenu()));

	}

}

/* End of file welcome.php */
/* Location: ./application/controllers/shelf.php */
