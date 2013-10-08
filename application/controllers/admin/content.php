<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Content extends MY_Controller {

	function __construct()
	{
		parent::__construct();
		$this->layout = New Layout();
	}

	function index()
	{
		$this->layout->show('admin/content');
	}

	function edit() {
		$id = $this->uri->segment(4);
		if (is_numeric($id) == true)
		{
			$this->layout->show('admin/content', array("id" => $id));
		}
	}

	function save_content() {
		$id = $this->input->post('id');
		$title = $this->input->post('title');
		$url_title = formatURL($title);
		$content = $this->input->post('content');
		$content_data = array(
        	'title' => $title,
        	'url_title' => $url_title,
        	'content' => $content
        );
		$this->db->where('id', $id);
		$this->db->update('pages', $content_data); 
		$this->session->set_flashdata("message", "Saved");
		redirect("admin/content/edit/$id");
	}
}

/* End of file content.php */
/* Location: ./application/controllers/admin/content.php */