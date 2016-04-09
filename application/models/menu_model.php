<?php
class Menu_model extends CI_Model {    

  public function getMenu($book = null, $uri = null) {
    $this->load->model('shelf_model');
    $menu = array();

    $menu[] = array(
      'title' => 'Free software (github.com)',
      'url' => "https://github.com/Pageprism/pageprism",
    );
    //Add principles shelf
    foreach ($this->shelf_model->getShelvesForParent('principles') as $shelf) {
      $menu[] = array(
        'title' => $shelf->name,
        'url' => "/shelf/".$shelf->id,
      );
    }

    $this->logged_in = $this->session->userdata('user_name') != "";

    $this->addCurrentBook($menu, $book);
    $this->addShelves($menu);
    $this->addLogin($menu, $uri);
    $this->processClasses($menu, $uri);

    return $menu;
  }

  function addCurrentBook(&$menu, $book) {
    if (!$book) return;
    $this->load->model('shelf_model');
    $this->load->model('book_model');

    $children = array();
    $items = array();

    $has_audio = $this->book_model->hasAudio($book->id);
    if ($has_audio) {
      $children[] = array(
        'id' => 'playpause',
        'title' => 'Play album',
      );
    }
      
    if ($this->logged_in) {
      $children[] = array(
        'title' => 'Edit this book',
        'url' => '/admin/document/modify/'.$book->id,
        'popUnder' => true,
      );
    }

    foreach(array_map('trim', explode(',',$book->book_author)) as $author) {
      $items['Authors'][] = array(
        'title' => $author,
        'url' => '/author/'.rawurlencode($author)
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
        'url' => '/language/'.rawurlencode($language)
      );
    }
    foreach(array_map('trim', explode(',',$book->book_timestamp)) as $timestamp) {
      $items['Years'][] = array(
        'title' => $timestamp,
        'url' => '/year/'.rawurlencode($timestamp)
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
      'children' => $children,
    );

  }
  function addShelves(&$menu) {
    $shelves = array();
      
    if ($this->logged_in) {
      $shelves[] = array(
        'title' => 'Edit collections',
        'url' => "/admin/shelf",
        'popUnder' => true,
      );
    }
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

  function addLogin(&$menu, $uri) {
    if ($this->logged_in) {
      $menu[] = array(
        'title' => 'Log out',
        'url' => "/logout"
      );
    } else {
      if (!$uri) $uri = '/'.$this->uri->uri_string;
      $menu[] = array(
        'title' => 'Log in',
        'url' => "/login?backUrl=".urlencode($uri),
        'popUnder' => true,
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

      if ($menuitem['url'] == $uri || !empty($menuitem['open'])) {
        $selected = true;
        $classes[] = 'selected';
      }
      if (!empty($menuitem['children'])) {
        $classes[] = 'parent';
        $selected = $this->processClasses($menuitem['children'], $uri) || $selected;
      }
      if ($selected) {
        $someItemSelected = true;
      }
      $menuitem['classes'] = implode(' ',$classes);
    }

    return $someItemSelected;
  }

}


