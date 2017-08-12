<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 5.1.6 or newer
 *
 * @package        CodeIgniter
 * @author        EllisLab Dev Team
 * @copyright    Copyright (c) 2006 - 2011, EllisLab, Inc.
 * @license        http://codeigniter.com/user_guide/license.html
 * @link        http://codeigniter.com
 * @since        Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * Legacy_helper
 *
 * This helper retrieves environment specific configurations and variables
 */

if (!function_exists('get_env_name')) {
    function get_env_name()
    {
        $env_key = json_decode(file_get_contents('application/config/env_key.json'));
        return $env_key->name;
    }
}

if (!function_exists('get_env_config')) {
    function get_env_config()
    {
        $env_name = get_env_name();
        $env_cnf = json_decode(file_get_contents('application/envs/env.' . $env_name . '.json'));
        return $env_cnf;
    }
}

if (!function_exists('get_worker_config')) {
    function get_worker_config()
    {
        $env_cnf = get_env_config();
        $workerCnf_file = $env_cnf->module->worker->path.'/worker.json';
        $workerCnf = json_decode(file_get_contents($workerCnf_file));
        return $workerCnf;
    }
}
