<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
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

$route['noop'] = 'not';
$route['default_controller'] = 'app';
$route['404_override'] = '';
$route['fonts/(:any)'] = 'welcome/fonts/$1';
$route['img/(:any)'] = 'welcome/img/$1';
$route['worker'] = 'welcome/worker';


/**
 * Pageshare Restful API
 */
//API/Collection
$route['api/collection']['get'] = 'api/CollectionAPI/get';
$route['api/collection/(:any)']['get'] = 'api/CollectionAPI/get/$1';
$route['api/collection']['post'] = 'api/CollectionAPI/post';
$route['api/collection/(:any)']['put'] = 'api/CollectionAPI/put/$1';
$route['api/collection/(:any)']['delete'] = 'api/CollectionAPI/delete/$1';

//API/User
$route['api/user']['get'] = 'api/UserAPI/get';
$route['api/user/(:any)']['get'] = 'api/UserAPI/get/$1';
$route['api/user']['post'] = 'api/UserAPI/post';
$route['api/user/(:any)']['put'] = 'api/UserAPI/put/$1';
$route['api/user/(:any)']['delete'] = 'api/UserAPI/delete/$1';

//API any
$route['api/(:any)'] = 'api/$1';


//cmd
$route['cmd/doc/modify/(:num)'] = 'cmd/doc/update_doc/$1';
$route['cmd/doc/find_one/(:num)'] = 'cmd/doc/find_one/$1';
$route['cmd/(:any)'] = 'cmd/$1';

//file
$route['file/(:num)'] = 'cmd/file/index/$1';
$route['pdf/(:any)/(:num)'] = 'cmd/file/pdf/$2';//(:any) is reserved for the name of the doc used in special links
$route['epub/(:any)/(:num)'] = 'cmd/file/epub/$2';
$route['image/(:num)'] = 'cmd/file/image/$1';
$route['cover/(:num)'] = 'cmd/file/cover/$1';
$route['page/:(num)/(:num)'] = 'cmd/file/page/&1/$2';
$route['file/(:any)'] = 'cmd/file/&1';

//Admin
$route['login'] = 'admin/auth';
$route['logout'] = 'admin/auth/logout';
$route['admin/shelf'] = 'admin/shelf/index';
$route['admin/shelf/modify/(:any)'] = 'admin/shelf/modify/$1';
$route['admin/shelf/remove/(:any)'] = 'admin/shelf/remove/$1';
$route['admin/shelf/set_frontpage_bit/(:any)/(:num)'] = 'admin/shelf/update_frontpage_bit/$1';
$route['admin/document/modify/(:num)'] = 'cmd/legacydoc/modify/$1';
$route['admin/document/(:any)'] = 'cmd/legacydoc/$1';
$route['admin/(:any)'] = 'admin/$1';
//Books
$route['author/(:any)'] = 'shelf/aggregate/author/$1';
$route['language/(:any)'] = 'shelf/aggregate/language/$1';
$route['year/(:any)'] = 'shelf/aggregate/year/$1';
$route['search/(:any)/(:any)'] = 'shelf/aggregate/$1/$2';
$route['shelf/(:num)'] = 'shelf/view/$1';
$route['shelf/(:num)/reorder'] = 'admin/shelf/reorder/$1';
$route['ajax/load_menu'] = 'menu/load_menu';
//$route['ajax/load_book'] = 'bookController/book_info';
$route['ajax/load_book'] = 'cmd/doc/doc_info';
$route['ajax/autocomplete/attributes'] = 'admin/document/autocomplete_attributes';
$route['book/(:any)'] = 'bookController/view/$1/p1';
$route['book/(:any)/p(:num)'] = 'bookController/view/$1/p$2';
$route['app/(:any)'] = 'app/view/';
$route['(:any)'] = 'app/view/';
//$route['(:any)/p(:num)'] = 'bookController/view/$1/p$2';
//$route['(:any)'] = 'bookController/view/$1/p1';


/* End of file routes.php */
/* Location: ./application/config/routes.php */
