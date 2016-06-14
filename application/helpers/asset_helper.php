<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

define('ASSETPATH', dirname(APPPATH).'/assets/');
if (!function_exists('load_script'))
{
  function load_script($name) {
    $filename = ASSETPATH.'js/'.$name.'.js';
    $v = filemtime($filename);
    $url = base_url(). "assets/js/$name.js?v=$v";
    return '<script src="'.$url.'"></script>';
    
  }
}
if (!function_exists('load_stylesheet'))
{
  function load_stylesheet($name) {
    $filename = ASSETPATH.'css/'.$name.'.css';
    $v = filemtime($filename);
    $url = base_url(). "assets/css/$name.css?v=$v";
    return '<link href="'.$url.'" rel="stylesheet" media="screen" />';
  }
}
