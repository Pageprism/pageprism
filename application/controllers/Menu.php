<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Menu extends CI_Controller {

	public function load_menu() {
    $book_id = $this->input->post('book');
    $uri = $this->input->post('url');

    if ($book_id) {
      $this->load->model('book');
      $book = $this->book->loadBook($book_id);
      if ($book) {
        $this->load->view('menu', array('menu' => $this->Menu_model->getMenu($book, $uri)));
        return;
      }
    }

    $this->load->view('menu', array('menu' => $this->Menu_model->getMenu(null, $uri)));

	}

}

/* End of file welcome.php */
/* Location: ./application/controllers/shelf.php */
