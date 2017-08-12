<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class App
 * The new system way to init client
 */
class App extends CI_Controller
{

    function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        redirect("/app");
    }

    public function view()
    {

        $this->layout->show('app', array('index_id' => 'Sing Page Application'));
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/shelf.php */
