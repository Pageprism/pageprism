<?php
class BookAttributes extends CI_Model {

  private $titleCache = array();

  public function getTitle($type, $name) {
    if (!isset($this->titleCache[$type][$name])) {
      $rows = $this->db->get_where('attribute_title', array(
        'type' => $type,
        'name' => $name,
      ))->result();
      print_r($rows);

      if (!$rows) {
        $row = new stdClass;
        $row->type = $type;
        $row->name = $name;
        $this->db->insert('attribute_title', $row);
        $row->id = $this->db->insert_id();
        $rows = array($row);
      }
      $this->titleCache[$type][$name] = reset($rows);
    }
    return $this->titleCache[$type][$name];
  }

  public function save($book, $type, $attribute, $values) {
    if (is_object($book)) $book = $book->id;
    $title = $this->getTitle($type, $attribute);
    $this->db->trans_start();
    $this->db->delete('book_attribute', array(
      'book_id' => $book,
      'title_id' => $title->id
    ));
    $ordering = 0;
    foreach($values as $value) {
      $row = new stdClass;
      $row->ordering = $ordering++;
      $row->book_id = $book;
      $row->title_id = $title->id;

      if (is_array($value)) {
        list($subtitle, $value) = $value;
        $row->subtitle_id = $this->getTitle($type, $subtitle)->id;
      } else {
        $row->subtitle_id = null;
      }
      $row->value = $value;
      $this->db->insert('book_attribute', $row);
    }
    $this->db->trans_complete();
  }

  /** Attaches attributes to books */
  public function loadInto($booklist) {
    $books = array();
    foreach($booklist as $book) {
      $books[$book->id] = $book;
      $book->attributes = new stdClass;
    }
    $ids = array_keys($books);
    
    $data = $this->db->
      select('title.type', 'title.name', 'subtitle.name', 'value')->
      from('book_attribute')->
      join('attribute_title as title', 'title.id = title_id')->
      join('attribute_title as subtitle', 'title.id = subtitle_id')->
      where_in('book_id', $ids)->
      order_by('ordering', 'asc')->get()->result();

    foreach($data as $row) {
      if (!isset($book->attributes->{$row->type})) {
        $book->attributes->{$row->type} = new stdClass;
      }
      $book->attributes->{$row->type}->{$row->title} = $row;
    }
  }

}
