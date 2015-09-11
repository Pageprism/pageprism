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
			$name = $this->uri->segment(2);
			$page_n = substr($this->uri->segment(3),1);
		}

		$query = $this->db->query("SELECT * FROM book WHERE book.book_name_clean = '$name'");
		if ($query->num_rows() > 0)
		{
			foreach ($query->result_array() as $row)
			{
				$this->layout->show('index', array('rendered_content' => $this->load_pages($row['id'],$page_n,"0","0"), 'shelf_id' => $row['shelf_id'], 'page' => $page_n, 'book_id' => $row['id'], 'totalpages' => $row['pages'], 'title' => $row['book_name'], 'book_author' => $row['book_author'], 'book_timestamp' => $row['book_timestamp'], 'id' => $row['id']));
			}
		} else {
			//echo 'no results (view) "SELECT * FROM book WHERE book.book_name_clean = "'.$name.'"';
			redirect("/");
		}
	}

	public function song() {
		$name = $this->uri->segment(2);

		$query = $this->db->query("SELECT * FROM book WHERE book_name_clean = '$name' AND type='mp3'");
		if ($query->num_rows() > 0)
		{
			foreach ($query->result_array() as $row)
			{
				$this->layout->show('index', array('rendered_content' => $this->load_pages($row['id'],"1","1","0"), 'shelf_id' => $row['shelf_id'], 'page' => "1", 'book_id' => $row['id'], 'title' => $row['book_name'], 'format_music' => "yes", 'book_author' => $row['book_author'], 'book_timestamp' => $row['book_timestamp'], 'id' => $row['id']));
			}
		} else {
			redirect("/");
		}
	}

	public function download_file() {
		$name = $this->uri->segment(2);

		$query = $this->db->query("SELECT * FROM book WHERE book_name_clean = '$name' AND type='epub'");
		if ($query->num_rows() > 0)
		{
			foreach ($query->result_array() as $row)
			{
				$this->layout->show('index', array('rendered_content' => $this->load_pages($row['id'],"1","0","1"), 'shelf_id' => $row['shelf_id'], 'page' => "1", 'book_id' => $row['id'], 'title' => $row['book_name'], 'book_author' => $row['book_author'], 'book_timestamp' => $row['book_timestamp'], 'id' => $row['id']));
			}
		} else {
			redirect("/");
		}
	}

	public function load_pages_js() {
		$post_data = $this->input->post();
		if ($post_data) {
			$id = $post_data['id'];
			$page_n = $post_data['page_n'];
			$type = $post_data['type'];
			$music = $type == 'mp3';
			$download = $type == 'epub';
			echo $this->load_pages($id,$page_n,$music,$download);
		}
		
  }

  public function get_page_count($id) {
    $query = $this->db->query("SELECT count(*) as pagecount FROM pdf,book WHERE pdf.book_id='$id' and pdf.book_id = book.id");
    return $query->row()->pagecount;
  }

	public function load_pages($id, $page_n, $music, $download) {
		if ($music == "1" || $download == "1") {
			$query = $this->db->query("SELECT * FROM book WHERE id='$id'");
    } elseif ($page_n == "all") {
      return $this->get_page_count($id);
		} else {
			$query = $this->db->query("SELECT pdf.*,book.* FROM pdf,book WHERE pdf.book_id='$id' and pdf.book_id = book.id and pdf.page_n='$page_n'");
		}
		
		if ($query->num_rows() > 0)
		{

      if ($music == 1 || $download == 1) {	
        $type = $music ? 'audio' : 'epub';
        return $this->load->view ('content', array('row' => $query->row(), 'type' => 'audio'), true);
			} else {
				foreach ($query->result_array() as $row)
				{
          $pages[] = $this->load->view ('content', array('row' => (object)$row, 'type' => 'page'), true);
        }
				return implode("\n", $pages);
			}
			
		} else {
			echo 'no results (load_pages)';
		}
	}

}

/* End of file welcome.php */
/* Location: ./application/controllers/book.php */
