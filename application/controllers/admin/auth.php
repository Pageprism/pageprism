<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Auth extends CI_Controller {

	function __construct()
	{
		parent::__construct();
	}

	function index()
  {
    $backUrl = $this->input->get('backUrl') ?: '/';
    if ($backUrl[0] != '/') $backUrl = '/';
    if (strpos($backUrl, '/login') === 0) $backUrl = '/';

		$user = $this->input->post('user');
		$password = $this->input->post('password');
		$posted = $this->input->post('posted');
		if ($posted == 'true')
		{
			if ($user && $password)
			{
        if($this->simpleloginsecure->login($user, $password)) {
          $this->session->set_flashdata('msg', "Log in successful");
          redirect($backUrl);
				} else {
          $this->layout->show('admin/auth', array('error' => 'Wrong username or password', 'backUrl' => $backUrl));
				}
			} else {
        $this->layout->show('admin/auth', array('error' => 'User or password empty', 'backUrl' => $backUrl));
			}			
		} else {
      $this->layout->show('admin/auth', array('error' => '', 'backUrl' => $backUrl));
		}

	}

	function logout()
	{
		$this->simpleloginsecure->logout();
    $this->session->set_flashdata('msg', "You have logged out");
		redirect('/');
	}
}

/* End of file auth.php */
/* Location: ./application/controllers/admin/auth.php */
