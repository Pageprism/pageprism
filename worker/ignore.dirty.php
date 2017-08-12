<?php
//require_once('service/AsyncPdfConversion.php');
require_once('common/DBManager.php');
require_once('common/PDFTaskBuilder.php');
require_once('service/ThumbGen.php');
require_once('service/PDFWork.php');
require_once('model/TaskBase.php');
require_once('model/DocBase.php');
require_once('model/DocPageBase.php');
require_once('model/FileBase.php');
require_once('common/WorkUtil.php');

class WorkLog
{
    public function __construct($log_file)
    {
        $this->util = new WorkUtil();
        $this->log_file = $log_file;
    }

    public function print($msg)
    {
        $this->util->work_log($msg, $this->log_file);
    }
}

function toPending()
{

    //$util->work_log("and here..", $log_file);
    $num = exec('whoami');
    $conf = json_decode(file_get_contents('/var/www/html/worker/worker.json'));
    $util = new WorkUtil();
    $dbManager = new DBManager($conf, $util);
    $taskBase = new TaskBase($conf, $dbManager, $util);
    $fileBase = new FileBase($conf, $dbManager, $util);
    $docBase = new DocBase($conf, $dbManager, $util);
    $docPageBase = new DocPageBase($conf, $dbManager, $util);
    $start_time = date('Y-m-d H:i:s');
    $_log = new WorkLog($conf->log_file);
    $_log->print("*\t\t\t\t\t\t\t*\n Pageshare TaskManager started at [$start_time]\n" .
        " Listening to incoming tasks...\n\t\t\t\t\t\t");
    $c = 1;
//while (true) {

    $pending = $taskBase->findDone();
//    $_log->print("\t".$util->logDate() . " Checking ...");
    while ($row = $pending->fetch_assoc()) {
        $task = $util->rowToTask($row);
        $doc = $docBase->findOne($task->doc_id)->fetch_assoc();
        $_log->print("\t" . $util->logDate() . " doc_id : " . $task->doc_id);
        $_log->print("\t" . $util->logDate() . " doc_name : " . $doc["name"]);
//        $_log->print("\t".$util->logDate() . " doc_url : ". $task->doc_id);
        $_log->print("\t" . $util->logDate() . " doc_pdf : " . $doc["pdf"]);
//        $marked = $taskBase->setAsActive($task->id);

//        if ($c > 0 && $task->doc_id === 96) {
        $marked = $taskBase->setAsPending($task->id);
//            $c--;
//        }
        if (!empty($marked)) {
            $_log->print("\t" . $util->logDate() . " New incoming '" . $task->type . "' task. Activating...[$marked] ");
        }

    }

//    sleep(2);
//}


}

function work()
{

    //$util->work_log("and here..", $log_file);
    $num = exec('whoami');
    $conf = json_decode(file_get_contents('/var/www/html/worker/worker.json'));
    $util = new WorkUtil();
    $dbManager = new DBManager($conf, $util);
    $taskBase = new TaskBase($conf, $dbManager, $util);
    $fileBase = new FileBase($conf, $dbManager, $util);
    $docBase = new DocBase($conf, $dbManager, $util);
    $docPageBase = new DocPageBase($conf, $dbManager, $util);
    $taskBuilder = new PDFTaskBuilder($docBase, $fileBase,
        $docPageBase, $util, $conf->log_file);
    $start_time = date('Y-m-d H:i:s');
    $_log = new WorkLog($conf->log_file);
    $_log->print("*\t\t\t\t\t\t\t*\n Pageshare TaskManager started at [$start_time]\n" .
        " Listening to incoming tasks...\n\t\t\t\t\t\t");
    $c = 1;
//while (true) {

    $pending = $taskBase->findPending();
//    $_log->print("\t".$util->logDate() . " Checking ...");
    while ($row = $pending->fetch_assoc()) {
        $taskRow = $util->rowToTask($row);
        $doc = $docBase->findOne($taskRow->doc_id)->fetch_assoc();
        $_log->print("\t" . $util->logDate() . " doc_id : " . $taskRow->doc_id);
        $_log->print("\t" . $util->logDate() . " doc_name : " . $doc["name"]);
//        $_log->print("\t".$util->logDate() . " doc_url : ". $task->doc_id);
        $_log->print("\t" . $util->logDate() . " doc_pdf : " . $doc["pdf"]);
//        $marked = $taskBase->setAsActive($task->id);

        if ($c > 0 && $taskRow->doc_id === 96) {

            $marked = $taskBase->setAsActive($taskRow->id);

            $c--;
        }
        if (!empty($marked)) {
            $_log->print("\t" . $util->logDate() . " New incoming '" . $taskRow->type . "' task. Activating...[$marked] ");
        }

    }

//    sleep(2);
//}

}

function simple()
{

    //$util->work_log("and here..", $log_file);
    $num = exec('whoami');
    $conf = json_decode(file_get_contents('/var/www/html/worker/worker.json'));
    $util = new WorkUtil();
    $dbManager = new DBManager($conf, $util);
    $taskBase = new TaskBase($conf, $dbManager, $util);
    $fileBase = new FileBase($conf, $dbManager, $util);
    $docBase = new DocBase($conf, $dbManager, $util);
    $docPageBase = new DocPageBase($conf, $dbManager, $util);
    $taskBuilder = new PDFTaskBuilder($docBase, $fileBase,
        $docPageBase, $util, $conf->log_file);
    $generator = new ThumbGen();
    $start_time = date('Y-m-d H:i:s');
    $_log = new WorkLog($conf->log_file);
    $_log->print("*\t\t\t\t\t\t\t*\n Pageshare TaskManager started at [$start_time]\n" .
        " Listening to incoming tasks...\n\t\t\t\t\t\t");
    $c = 1;
//while (true) {

//    $pending = $taskBase->findPending();
    $pending = $taskBase->findPending();
    $row = $pending->fetch_assoc();
    $task = $taskBuilder->build($row);
    $_log->print("\t" . $util->logDate() . " Starting new PDF-CONVERT job. Giving Task id".
        " [" . $row['id']."] to Doc [".$task->doc->id."]. The Pdf file for this job".
        " exists database with File id [".$task->pdfFile->id."]");
    $log_time = $util->logDate();
    $_log->print("\t\t\t+ $log_time Working on pdf file: ");
//  $_log->print("\t\t\t  [ 00:00:00 ] ");
    $_log->print("\t\t                - ".$task->pdfFile->full_path);
    $taskBase->setInQueue($task->id);
    $worker = new PDFWork($generator,$task,$taskBase);
//    $pool = new Pool(20);
//    $pool->submit($work);
    $worker->start();
    $log_time = $util->logDate();
    $_log->print("\t\t\t+ $log_time A worker dedicated for this job.".
        " The job  will be ready at some point. Please be patient.");

//    $doc = $docBase->findOne(96)->fetch_assoc();


}

//    sleep(2);
//}


//toPending();
//work();
simple();



