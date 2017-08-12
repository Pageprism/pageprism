<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 5.1.6 or newer
 *
 * @package      CodeIgniter
 * @author       EllisLab Dev Team
 * @copyright    Copyright (c) 2006 - 2011, EllisLab, Inc.
 * @license      http://codeigniter.com/user_guide/license.html
 * @link         http://codeigniter.com
 * @since        Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * Legacy_helper
 *
 * This helper Support legacy view and converts data based on the new model
 * to old structure.
 */

if (!function_exists('delete_any_file')) {
    function delete_any_file($path)
    {
        if (is_dir($path) === true) {
            $files = array_diff(scandir($path), array('.', '..'));

            foreach ($files as $file) {
                delete_any_file(realpath($path) . '/' . $file);
            }

            return rmdir($path);
        } else if (is_file($path) === true) {
            return unlink($path);
        }

        return false;
    }
}

if (!function_exists('get_file_info')) {
    function get_file_info($path)
    {
        $f_info = new SplFileInfo($path);
        if ($f_info->isFile()) {
            $fileInfo = new stdClass();
            $fileInfo->name = $f_info->getBasename();
            $fileInfo->path = $f_info->getPathInfo();
            $fileInfo->full_path = $f_info->getRealPath();
            $fileInfo->ext = $f_info->getExtension();
            $fileInfo->raw_name = str_replace($f_info->getBasename(), "",
                "." . $f_info->getExtension());
            $fileInfo->type = $f_info->getExtension();
            $fileInfo->size = $f_info->getSize();
            return $fileInfo;
        } else {
            return null;
        }

    }
}

if (!function_exists('upgrade_file')) {
    function upgrade_file($docModel, $fileModel, $doc_id, $newFilePath, $file_type)
    {
        $fileData = new SplFileInfo($newFilePath);
//                $file_name = $data['file_name'];
        $file_name = $fileData->getFilename();
//                $file_path = $data['file_path'];
        $file_path = $fileData->getPath();
//                $full_path = $data['full_path'];
        $full_path = $fileData->getRealPath();
//                $file_type = $data['file_type'];
//                $raw_name = $data['raw_name'];
        $raw_name = $fileData->getBasename();
//                $file_ext = $data['file_ext'];
        $file_ext = $fileData->getExtension();
//                $file_size = $data['file_size'];
        $file_size = $fileData->getSize();
        $file_id = $fileModel->create($file_name, $file_path,
            $full_path, $file_ext, $raw_name, $file_type, $file_size);
//                ($name,$path,$full_path,$ext,$raw_name,$type)

        $docModel->updateFile($doc_id, $file_id, $file_type, $file_ext);

    }
}
if (!function_exists('upgrade_file_with_data')) {
    function upgrade_file_from_data($docModel, $fileModel, $doc_id, $data)
    {
        $file_name = $data['file_name'];
        $file_path = $data['file_path'];
        $full_path = $data['full_path'];
        $file_type = $data['file_type'];
        $raw_name = $data['raw_name'];
        $file_ext = $data['file_ext'];
        $file_size = $data['file_size'];
        $file_id = $fileModel->create($file_name, $file_path,
            $full_path, $file_ext, $raw_name, $file_type, $file_size);
//                ($name,$path,$full_path,$ext,$raw_name,$type)

        $docModel->updateFile($doc_id, $file_id, $file_type, $file_ext);

    }
}

if (!function_exists('convert_pdf')) {
    function convert_pdf($doc_id,$taskModel,$task_cnf,$env_cnf)
    {
        //$taskCnf = json_decode(file_get_contents('/var/www/html/pageshare/worker/worker.json'));
        $worker_path = $env_cnf->module->worker->path;
        $worker_main = $worker_path . '/' . $env_cnf->module->worker->main;
        $taskBase = $taskModel->init($task_cnf);
        $task = new stdClass();
        $task->doc_id = $doc_id;
        $task->type = 'pdf-convert';
        $taskBase->createPendingTask($task);
        Proc_Close(Proc_Open('/usr/bin/php ' . $worker_main . ' &', Array(), $_ENV));

    }
}



