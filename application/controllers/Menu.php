<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Menu extends CI_Controller {

	public function load_menu() {
    $uri = $this->input->post('url');
    $this->load->view('menu', array('menu' => $this->Menu_model->getMenu($uri)));
	}

}
