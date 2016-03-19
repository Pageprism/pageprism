<?php
class Book_model extends CI_Model {
  
  public function isSuitableUrlName($name) {
    $file_paths = array('assets', 'content');

    if (in_array($name, $file_paths)) return false;
  }
  public function loadBook($bookId) {
		$query = $this->db->query("SELECT * FROM book WHERE book.id = ?",(int)$bookId);
    $book = $query->result();
    return $book ? $book[0] : null; 
  }
  public function loadBookByName($name) {
		$query = $this->db->query("SELECT * FROM book WHERE book.book_name_clean = ?", $name);
    $book = $query->result();
    return $book ? $book[0] : null; 
  }

  public function loadShelf($id) {
		$query = $this->db->query("SELECT * FROM book WHERE book.shelf_id = ? order by ordering asc", $id);
    return $query->result();
  }
  public function loadAggregateShelf($key, $value) {
    static $allowed_keys = array('author' => 'book_author', 'year' => 'book_timestamp', 'language' => 'language');
    if (empty($allowed_keys[$key])) return array();
    $column = $allowed_keys[$key];

		$query = $this->db->query("SELECT * FROM book WHERE book.$column LIKE ? order by book_name asc", "%$value%");
    return $query->result();
  }

  public function hasAudio($id) {
		$query = $this->db->query("SELECT count(*) as count FROM audio_file WHERE book_id = ?", $id);
    $res = $query->row();
    return (bool)($res->count) ?: false;
  }

}
