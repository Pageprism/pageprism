<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Shelf extends MY_Controller {

	function __construct()
  {
		parent::__construct();
    $this->load->model('shelf_model');
	}

	function index()
	{
    $this->layout->show('admin/shelves', array('shelves' => $this->shelf_model->getShelves()));
	}

	function add_shelf()
	{
		$name = $this->input->post('shelf_name');
    $sql_data = array(
      'name' => $name, 
      'created' => date('Y-m-d H:i:s')
    );
		$this->db->insert('shelf', $sql_data);
		redirect('admin/shelf/');
  }

	function modify()
	{
    $id = $this->uri->segment(4);
    $shelf = $this->shelf_model->getShelf($id);
    $this->layout->show('admin/shelf/modify',array('shelf' => $shelf));
	}
	function update_info()
	{
		$id = $this->input->post('id');

    $sql_data = array(
      'name' => $this->input->post('name'),
      'menu_parent' => $this->input->post('menu_parent'),
    );
    $this->db->where('id', $id);
		$this->db->update('shelf', $sql_data);
		redirect('admin/shelf/');
	}

	function remove()
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
