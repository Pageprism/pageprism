<?php

class Shelf_model extends CI_Model {
  
  public function getShelves() {
    $query = $this->db->query('SELECT shelf.*, count(*) as bookcount FROM shelf join book on book.shelf_id = shelf.id group by shelf.id order by id desc');

    if ($query->num_rows() == 0) return array();

    return $query->result_array();
  }
  public function getShelf($id) {
    $query = $this->db->query("SELECT * FROM shelf WHERE `id`= ?", array((int)$id));

    if ($query->num_rows() == 0) return null;

    return $query->row();
  }
}
