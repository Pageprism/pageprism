<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Shelf extends MY_Controller {

	function __construct()
	{
		parent::__construct();
	}

	function index()
	{
		$this->layout->show('admin/shelf');
	}

	function add_shelf()
	{
		$name = $this->input->post('shelf_name');
		$sql_data = array('name' => $name);
		$this->db->insert('shelf', $sql_data);
		redirect('admin/shelf/');
	}

	function remove_shelf()
	{
		$id = $this->uri->segment(4);
		if (is_numeric($id) == true)
		{
			if ($this->db->delete('shelf', array('id' => $id)) == true)
				redirect('admin/shelf/');
		} else {
			echo 'ID Error: '.$this->uri->segment(4);
		}
	}

}

/* End of file shelf.php */
/* Location: ./application/controllers/admin/shelf.php */