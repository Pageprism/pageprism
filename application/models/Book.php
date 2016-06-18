<?php
class Book extends CI_Model {
  
  public function isSuitableUrlName($name) {
    $file_paths = array('assets', 'content');

    if (in_array($name, $file_paths)) return false;
  }

  public function __construct() {
    parent::__construct();
    $this->load->model('BookAttributes');
  }

  public function loadBook($bookId) {
		$query = $this->db->query("SELECT * FROM book WHERE book.id = ?",(int)$bookId);
    $books = $query->result();
    $this->BookAttributes->loadInto($books);

    if (!$books) return null;
    return $books[0];
  }
  public function loadBookByName($name) {
		$query = $this->db->query("SELECT * FROM book WHERE book.book_name_clean = ?", $name);
    $books = $query->result();
    $this->BookAttributes->loadInto($books);

    if (!$books) return null;
    return $books[0];
  }

  public function loadShelf($id) {
    $user_id = $this->session->userdata('user_id');
    $query = $this->db->query("SELECT * FROM book WHERE book.shelf_id = ? 
      and (public OR author_id = ?) order by ordering asc", [$id, $user_id]);
    $books = $query->result();
    $this->BookAttributes->loadInto($books);

    return $books;
  }
  public function loadAggregateShelf($key, $value) {
    $user_id = $this->session->userdata('user_id');

    $query = $this->db->query("SELECT book.* FROM book 
      INNER JOIN book_attribute as ba ON book.id = ba.book_id
      INNER JOIN attribute_title as at ON ba.title_id = at.id
      WHERE ba.value LIKE ? 
      AND at.type = 'attribute'
      AND at.name = ?
      AND (public OR author_id = ?) AND allow_aggregating
      ORDER BY book_name asc", 
      array($value, $key, $user_id)
      );
    $books = $query->result();
    $this->BookAttributes->loadInto($books);

    return $books;
  }

  public function hasAudio($id) {
		$query = $this->db->query("SELECT count(*) as count FROM audio_file WHERE book_id = ?", $id);
    $res = $query->row();
    return (bool)($res->count) ?: false;
  }

  public function saveBook($book) {
    
  }

}
