<?php

class Shelf_model extends CI_Model {
  
  public function getShelves() {
    $query = $this->db->query('SELECT shelf.*, count(book.id) as bookcount FROM shelf left join book on book.shelf_id = shelf.id group by shelf.id order by shelf.id desc');

    if ($query->num_rows() == 0) return array();

    return $query->result_array();
  }
  public function getShelvesForParent($parent) {
    $query = $this->db->query('SELECT * FROM shelf WHERE menu_parent = ? order by id desc',
      array($parent)
    );

    if ($query->num_rows() == 0) return array();

    return $query->result_array();
  }
  public function getShelf($id) {
    $query = $this->db->query("SELECT * FROM shelf WHERE `id`= ?", array((int)$id));

    if ($query->num_rows() == 0) return null;

    return $query->row();
  }
}
