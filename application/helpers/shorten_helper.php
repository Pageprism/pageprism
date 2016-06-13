<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if ( ! function_exists('shorten'))
{
  function shorten($str, $limit = 40) {
    if (strlen($str) <= $limit) return $str;

    return substr($str,0,$limit).'...';
  }
}
