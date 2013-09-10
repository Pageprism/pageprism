<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['book/load_pages'] = 'book/load_pages';
$route['book/load_pages_js'] = 'book/load_pages_js';
$route['music/(:any)'] = 'book/song/$1';
$route['epub/(:any)'] = 'book/download_file/$1';
$route['book/(:any)'] = 'book/view/$1/p1';
$route['book/(:any)/p(:num)'] = 'book/view/$1';
$route['shelf/(:num)'] = 'shelf/view/$1';
$route['page/(:any)'] = 'page/view/$1';
$route['admin'] = 'admin/index';
$route['admin/logout'] = 'admin/auth/logout';
$route['admin/shelf/remove/(:any)'] = 'admin/shelf/remove/$1';
$route['admin/content/edit/(:num)'] = 'admin/content/edit/$1';
$route['admin/document/modify/(:num)'] = 'admin/document/modify/$1';
$route['admin/(:any)'] = 'admin/$1';


/* End of file routes.php */
/* Location: ./application/config/routes.php */