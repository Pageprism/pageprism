<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

define('ASSETPATH', dirname(APPPATH).'/assets/');
if (!function_exists('load_script'))
{
  function load_script($name, $static = false) {
    $filename = ASSETPATH.'js/'.$name.'.js';
    $url = base_url(). "assets/js/$name.js";
    if (!$static) {
      $url .= '?v='.filemtime($filename);
    }
    header("Link: <{$url}>; rel=preload; as=script", false);
    return '<script src="'.$url.'"></script>';
    
  }
}
if (!function_exists('load_ux_js'))
{
    function load_ux_js($name, $static = false) {
        $filename = ASSETPATH.'ux/js/'.$name.'.js';
        $url = base_url(). "assets/ux/js/$name.js";
        if (!$static) {
            $url .= '?v='.filemtime($filename);
        }
        header("Link: <{$url}>; rel=preload; as=script", false);
        return '<script src="'.$url.'"></script>';

    }
}
if (!function_exists('load_vendor_script'))
{
    function load_vendor_script($name, $static = false) {
        $filename = ASSETPATH.'vendor/js/'.$name.'.js';
        $url = base_url(). "assets/vendor/js/$name.js";
        if (!$static) {
            $url .= '?v='.filemtime($filename);
        }
        header("Link: <{$url}>; rel=preload; as=script", false);
        return '<script src="'.$url.'"></script>';

    }
}
if (!function_exists('load_stylesheet'))
{
  function load_stylesheet($name, $static = false) {
    $filename = ASSETPATH.'css/'.$name.'.css';
    $url = base_url(). "assets/css/$name.css";
    if (!$static) {
      $url .= '?v='.filemtime($filename);
    }
    header("Link: <{$url}>; rel=preload; as=stylesheet", false);
    return '<link href="'.$url.'" rel="stylesheet" media="screen" />';
  }
}
if (!function_exists('load_ux_css'))
{
    function load_ux_css($name, $static = false) {
        $filename = ASSETPATH.'ux/css/'.$name.'.css';
        $url = base_url(). "assets/ux/css/$name.css";
        if (!$static) {
            $url .= '?v='.filemtime($filename);
        }
        header("Link: <{$url}>; rel=preload; as=stylesheet", false);
        return '<link href="'.$url.'" rel="stylesheet" media="screen" />';
    }
}
if (!function_exists('load_vendor_stylesheet'))
{
    function load_vendor_stylesheet($name, $static = false) {
        $filename = ASSETPATH.'vendor/css/'.$name.'.css';
        $url = base_url(). "assets/vendor/css/$name.css";
        if (!$static) {
            $url .= '?v='.filemtime($filename);
        }
        header("Link: <{$url}>; rel=preload; as=stylesheet", false);
        return '<link href="'.$url.'" rel="stylesheet" media="screen" />';
    }
}
