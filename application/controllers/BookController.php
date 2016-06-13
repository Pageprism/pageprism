<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class BookController extends CI_Controller {

	public function index() {
		redirect("/");
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
    
    $this->load->model('book');
    $book = $this->book->loadBookByName($name);
		if ($book)
		{
      $this->layout->show('shelf', array(
        'shelf_editable' => $this->session->userdata('logged_in'),
        'shelf_id' => $book->shelf_id,
        'shelf' => $this->book->loadShelf($book->shelf_id),
        'current_book' => $book,
        'current_page' => $page_n,
        'cover_image' => $book->file_url_cover,
      ));
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
    $this->load->model('book');
    $book = $this->book->loadBook($id);

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
      $pageContent[] = $this->load->view('content', array('book' => $book, 'page' => $row), true);
    }
    return implode("\n", $pageContent);
	}

}

/* End of file book.php */
/* Location: ./application/controllers/book.php */
