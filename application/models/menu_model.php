<?php
class Menu_model extends CI_Model {    

  public function getMenu() {
    $menu = array();


    $this->addPages($menu);
    $this->addShelves($menu);
    $this->addAdmin($menu);
    $this->processClasses($menu);

    return $menu;
  }

  function addPages(&$menu) {
    $pages = array();
    $pages[] = array(
      'title' => 'Free software',
      'url' => "https://github.com/Pageprism/pageprism",
    );
    $pages[] = array(
      'title' => 'PageShare plans and ideas',
      'url' => "/shelf/13",
    );
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
      'url' => "/shelf/13",
      'children' => $pages,
    );
  }
  function addShelves(&$menu) {
    $shelves = array();

    $query = $this->db->query("SELECT id,name FROM shelf ORDER BY id desc");
    if ($query->num_rows() > 0) {
      foreach ($query->result_array() as $shelf) {
        $shelves[] = array(
          'title' => $shelf['name'],
          'url' => "/shelf/".$shelf['id'],
        );
      }
    }
    $menu[] = array(
      'title' => 'Shelves',
      'url' => '#',
      'children' => $shelves
    );
  }

  function addAdmin(&$menu) {
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
            'title' => 'Shelfs',
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
        'url' => "/login"
      );
    }
  }
  function processClasses(&$menu) {
    $someItemSelected = false;

    foreach($menu as &$menuitem) {
      $selected = false;
      $classes = array();

      if ($menuitem['url'] == '/'.$this->uri->uri_string) {
        $selected = true;
        $classes[] = 'selected';
      }
      if (!empty($menuitem['children'])) {
        $classes[] = 'parent';
        $selected = $this->processClasses($menuitem['children']);
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


