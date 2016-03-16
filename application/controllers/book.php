<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Book extends CI_Controller {

	public function index() {
		redirect("/");
	}

	public function counter() {
		$input = $this->input->post();
		$id = $input['id'];
		$this->db->set('counter', 'counter+1', FALSE);
		$this->db->where('id', $id);
		$this->db->update('book');
	}

	public function view() {
		$post_data = $this->input->post();
		if ($post_data) {
			$name = $post_data['id'];
			$page_n = "1";
		} else {
			$name = $this->uri->rsegment(3);
			$page_n = substr($this->uri->rsegment(4),1);
		}

		$query = $this->db->query("SELECT * FROM book WHERE book.book_name_clean = '$name'");
		if ($query->num_rows() > 0)
		{
			foreach ($query->result_array() as $row)
      {
        $this->layout->show('index', array(
          'rendered_content' => $this->_load_pages($row['id'],$page_n),
          'shelf_id' => $row['shelf_id'],
          'page' => $page_n,
          'cover_image' => $row['file_url_cover'],
          'book_id' => $row['id'],
          'totalpages' => $row['pages'],
          'title' => $row['book_name'],
          'book_author' => $row['book_author'],
          'book_timestamp' => $row['book_timestamp'],
          'id' => $row['id']
        ));
			}
		} else {
			redirect("/");
		}
	}
  
	public function load_pages() {
		$post_data = $this->input->post();
		if ($post_data) {
			$id = $post_data['id'];
			$page_n = $post_data['page_n'];
			echo $this->_load_pages($id,$page_n);
		}
  }

	public function _load_pages($id, $page_n) {
    $query = $this->db->query("SELECT book.*, pdf.page_image_url, pdf.page_n 
      FROM book LEFT JOIN pdf ON pdf.book_id=book.id
      WHERE book.id = ? and (pdf.page_n = ? OR page_n IS NULL)", array($id, $page_n));
		
		if ($query->num_rows() == 0)
		{
      echo 'No results';
      return;
    }
    
    $pages = $query->result();
    $audio_files = $this->db->query("SELECT * FROM audio_file 
      WHERE book_id = ? and ? BETWEEN page_number_start AND page_number_end", array($id, $page_n))->result();

    // audio_file_url, track_number, title, album, length, page_number_start, page_number_end
    
    $pageContent = array();
    foreach ($pages as $row)
    {
      $row->audio_tracks = $audio_files;
      $pageContent[] = $this->load->view('content', array('page' => $row), true);
    }
    return implode("\n", $pageContent);
	}

}

/* End of file book.php */
/* Location: ./application/controllers/book.php */
