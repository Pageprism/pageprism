<?php

class Shelf_model extends CI_Model {
  
  public function getFrontPageLink($shelf_id) {
    $link = '/';
    if ($shelf_id) {
      $link .= '?from_shelf='.(int)$shelf_id;
    }
    return $link;
  }
  public function getFrontpageId($avoid_shelf = 0) {
    $shelf = $this->db->query("SELECT id FROM shelf where is_frontpage ORDER BY id !=? desc, rand() limit 1", array($avoid_shelf));
    $row = $shelf->row();
    return $row ? $row->id : null;
  }
  public function getShelves() {
    $query = $this->db->query('SELECT shelf.*, count(book.id) as bookcount FROM shelf left join book on book.shelf_id = shelf.id group by shelf.id order by shelf.id desc');

    if ($query->num_rows() == 0) return array();

    return $query->result();
  }
  public function getShelvesForParent($parent) {
    $query = $this->db->query('SELECT * FROM shelf WHERE menu_parent = ? order by id desc',
      array($parent)
    );

    if ($query->num_rows() == 0) return array();

    return $query->result();
  }
  public function getShelf($id) {
    $query = $this->db->query("SELECT * FROM shelf WHERE `id`= ?", array((int)$id));

    if ($query->num_rows() == 0) return null;

    return $query->row();
  }
}
