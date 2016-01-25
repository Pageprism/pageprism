<?php
class Menu_model extends CI_Model {    

  public function getMenu() {
    $menu = array();

    $this->addPages($menu);
    $this->addAdmin($menu);
    $this->processClasses($menu);

    return $menu;
  }

  function addPages(&$menu) {
    $query = $this->db->query("SELECT id,title,url_title FROM pages");
    if ($query->num_rows() > 0) {
      foreach ($query->result_array() as $pages_top) {
        $menu[] = array(
          'title' => $pages_top['title'],
          'url' => "/page/".$pages_top['url_title'],
        );
      }
    }
  }

  function addAdmin(&$menu) {
    $logged_in = $this->session->userdata('user_name') != "";
    if ($logged_in) {
      $menu[] = array(
        'title' => 'Admin',
        'url' => "#",
        'open' => $this->uri->segment(1) == 'admin',
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
    foreach($menu as &$menuitem) {
      $classes = array();

      if (!empty($menuitem['children'])) {
        $classes[] = 'parent';

        $this->processClasses($menuitem['children']);
      }
      if (!empty($menuitem['open'])) {
        $classes[] = 'open';
      }
      if ($menuitem['url'] == '/'.$this->uri->uri_string) {
        $classes[] = 'selected';
      }
      $menuitem['classes'] = implode(' ',$classes);
    }
  }

}


