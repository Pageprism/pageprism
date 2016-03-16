<?php
class Menu_model extends CI_Model {    

  public function getMenu($book = null, $uri = null) {
    $this->load->model('shelf_model');
    $menu = array();

    $menu[] = array(
      'title' => 'Free software (github.com)',
      'url' => "https://github.com/Pageprism/pageprism",
    );

    $this->addCurrentBook($menu, $book);
    $this->addPages($menu);
    $this->addShelves($menu);
    $this->addAdmin($menu, $uri);
    $this->processClasses($menu, $uri);

    return $menu;
  }

  function addCurrentBook(&$menu, $book) {
    if (!$book) return;
    $this->load->model('shelf_model');

    $children = array();
    $items = array();
    foreach(array_map('trim', explode(',',$book->book_author)) as $author) {
      $items['Authors'][] = array(
        'title' => $author,
      );
    }
    $shelf = $this->shelf_model->getShelf($book->shelf_id);
    if ($shelf) {
      $items['Collections'][] = array(
        'title' => $shelf->name,
        'url' => "/shelf/".$shelf->id,
      );
    }
    //TODO: Categories
    foreach(array_map('trim', explode(',',$book->language)) as $language) {
      $items['Languages'][] = array(
        'title' => $language,
      );
    }
    foreach(array_map('trim', explode(',',$book->book_timestamp)) as $timestamp) {
      $items['Years'][] = array(
        'title' => $timestamp,
      );
    }
    foreach($items as $title => $subItems) {
      $children[] = array(
        'title' => $title,
        'children' => $subItems
      );
    }


    $menu[] = array(
      'id' => 'current_book_info',
      'title' => $book->book_name,
      'url' => "/$book->book_name_clean",
      'children' => $children
    );

  }
  function addPages(&$menu) {
    $pages = array();
    foreach ($this->shelf_model->getShelvesForParent('principles') as $shelf) {
      $pages[] = array(
        'title' => $shelf->name,
        'url' => "/shelf/".$shelf->id,
      );
    }
    $query = $this->db->query("SELECT id,title,url_title FROM pages");
    if ($query->num_rows() > 0) {
      foreach ($query->result_array() as $page) {
        $pages[] = array(
          'title' => $page['title'],
          'url' => "/page/".$page['url_title'],
        );
      }
    }
    $menu[] = array(
      'title' => 'Principles',
      'url' => "#",
      'children' => $pages,
    );
  }
  function addShelves(&$menu) {
    $shelves = array();

    foreach ($this->shelf_model->getShelvesForParent('shelves') as $shelf) {
      $shelves[] = array(
        'title' => $shelf->name,
        'url' => "/shelf/".$shelf->id,
      );
    }
    $menu[] = array(
      'title' => 'Collections',
      'url' => '#',
      'children' => $shelves
    );
  }

  function addAdmin(&$menu, $uri) {
    if (!$uri) $uri = '/'.$this->uri->uri_string;
    $logged_in = $this->session->userdata('user_name') != "";
    if ($logged_in) {
      $menu[] = array(
        'title' => 'Admin',
        'url' => "#",
        'children' => array(
          array(
            'title' => 'Upload document',
            'url' => "/admin/document/upload",
          ),
          array(
            'title' => 'Modify document',
            'url' => "/admin/document/documentlist",
          ),
          array(
            'title' => 'Collections',
            'url' => "/admin/shelf",
          ),
          array(
            'title' => 'Edit content',
            'url' => "/admin/content",
          ),
          array(
            'title' => 'Log out',
            'url' => "/logout"
          ),
        )
      );
    } else {
      $menu[] = array(
        'title' => 'Log in',
        'url' => "/login?backUrl=".urlencode($uri)
      );
    }
  }
  function processClasses(&$menu, $uri = null) {
    if (!$uri) $uri = '/'.$this->uri->uri_string;
    $someItemSelected = false;
    
    foreach($menu as &$menuitem) {
      if (!isset($menuitem['url'])) {
        $menuitem['url'] = '';
      }
      $selected = false;
      $classes = array();
      if (isset($menuitem['classes'])) {
        $classes[] = $menuitem['classes'];
      }

      if ($menuitem['url'] == $uri) {
        $selected = true;
        $classes[] = 'selected';
      }
      if (!empty($menuitem['children'])) {
        $classes[] = 'parent';
        $selected = $this->processClasses($menuitem['children'], $uri) || $selected;
      }
      if ($selected) {
        $classes[] = 'open';
        $someItemSelected = true;
      }
      $menuitem['classes'] = implode(' ',$classes);
    }

    return $someItemSelected;
  }

}


