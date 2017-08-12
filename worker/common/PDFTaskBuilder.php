<?php

/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5.1.2017
 * Time: 16:25
 */
class PDFTaskBuilder
{

    public function __construct($docBase, $fileBase, $docPageBase,
                                $workUtil = null, $log = null)
    {

        $this->util = $workUtil;
        $this->docBase = $docBase;
        $this->fileBase = $fileBase;
        $this->docPageBase = $docPageBase;
        $this->log = $log;
    }

    private function work_log($msg)
    {
        if (empty($this->util)) {
            return false;
        }
        return $this->util->work_log($msg, $this->log);
    }

    public function build($taskRow)
    {

        $task = $this->util->rowToTask($taskRow);
        $this->work_log("row is ");
//        $this->work_log($task);
        $this->work_log(print_r($taskRow,true));
        $this->work_log($task->id);
        $this->work_log($task->doc_id);
//        $this->work_log($task->doc->pdf);
        $task->doc = (object)($this->docBase->findOne($task->doc_id)->fetch_assoc());
        $task->pdfFile = (object)($this->fileBase->findOne($task->doc->pdf)->fetch_assoc());
        //removing the trailing slash from the end of the path
        $p = substr_replace($task->pdfFile->path, '', -1);
        $task->outputDir = $p;
        $task->resolutions = array(300, 120);
        $task->job = new JobSave($task->doc, $this->fileBase,
            $this->docPageBase, $this->util, $this->log);
        return $task;
    }


}

class JobSave
{
    function __construct($doc, $fileBase, $docPageBase, $util, $log)
    {
        $this->doc = $doc;
        $this->fileBase = $fileBase;
        $this->docPageBase = $docPageBase;
        $this->util = $util;
        $this->log = $log;
    }

    public function save($pageFiles)
    {

        foreach ($pageFiles as $res => $pages) {
            $log_time = $this->util->logDate();
            $this->work_log("\t\t\t+ $log_time PDF-CONVERT routine" .
                " created [" . count($pages) . "] pages with resolution [$res dpi]." .
                " Saving pages data in database...");
            foreach ($pages as $pageNum => $path) {
                list($width, $height) = getimagesize($path);
                $file_id = $this->saveFile($path);
                if (!empty($file_id)) {
                    $pageInfo = new stdClass();
                    $pageInfo->doc_id = $this->doc->id;
                    $pageInfo->file_id = $file_id;
                    $pageInfo->number = $pageNum;
                    $pageInfo->resolution = $res;
                    $pageInfo->width = $width;
                    $pageInfo->height = $height;
                    $this->docPageBase->insertPage($pageInfo);
                } else {
                    $log_time = $this->util->logDate();
                    $this->work_log("\t\t\t $log_time" .
                        " Error bad DocPage candidate file: $path.");
                }


            }
        }

    }

    private function saveFile($path)
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
            $fileInfo->type = "image/png";
            $fileInfo->size = $f_info->getSize();

            return $this->fileBase->create($fileInfo);
        } else {
            $this->work_log("\t" . $this->util->logDate() .
                " Error bad DocPage candidate file: $path.");
            return null;
        }
    }

    private function work_log($msg)
    {
        if (empty($this->util)) {
            return false;
        }
        return $this->util->work_log($msg, $this->log);
    }
}