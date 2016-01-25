<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Auth extends CI_Controller {

	function __construct()
	{
		parent::__construct();
	}

	function index()
	{
		$user = $this->input->post('user');
		$password = $this->input->post('password');
		$posted = $this->input->post('posted');
		if ($posted == 'true')
		{
			if ($user && $password)
			{
				if($this->simpleloginsecure->login($user, $password)) {
				    redirect('admin/index');
				} else {
					$this->layout->show('admin/auth', array('error' => 'wrong username or password'));
				}
			} else {
				$this->layout->show('admin/auth', array('error' => 'user or password empty'));
			}			
		} else {
			$this->layout->show('admin/auth', array('error' => ''));
		}

	}

	function logout()
	{
		$this->simpleloginsecure->logout();
		redirect('/');
	}
}

/* End of file auth.php */
/* Location: ./application/controllers/admin/auth.php */
