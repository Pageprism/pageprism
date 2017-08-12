<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Welcome extends CI_Controller
{

    public function index()
    {

    }

    public function fonts(){
        redirect('assets/fonts/'.$this->uri->segment(2));
    }
    public function img(){
        redirect('assets/img/'.$this->uri->segment(2));
    }
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
