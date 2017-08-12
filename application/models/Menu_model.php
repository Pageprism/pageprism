<?php
class Menu_model extends CI_Model {

    /**
     * from legacy code and still creates some weak dependency to community
     * functionality "MainMenu"
     */
  public function getMenu($uri = null) {
    $this->load->model('shelf_model');
    $menu = array();

    $menu[] = array(
      'title' => 'Scroll to top',
      'url' => "#",
      'classes' => 'scroll_to_top'
    );
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

    $this->addShelves($menu);
//    $this->addLogin($menu, $uri);
    $this->processClasses($menu, $uri);

    return $menu;
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


