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

function getConfig()
{
    $base = dirname(__FILE__);
    $cnf = json_decode(file_get_contents($base . '/worker.json'));
    return $cnf;
}

function toPending()
{
    $conf = getConfig();
    $util = new WorkUtil();
    $dbManager = new DBManager($conf, $util);
    $taskBase = new TaskBase($conf, $dbManager, $util);

    $pending = $taskBase->findDone();
    while ($row = $pending->fetch_assoc()) {
        $task = $util->rowToTask($row);
        $taskBase->setAsPending($task->id);
    }
    $pending = $taskBase->findActive();
    while ($row = $pending->fetch_assoc()) {
        $task = $util->rowToTask($row);
        $taskBase->setAsPending($task->id);
    }
    $pending = $taskBase->findInQueue();
    while ($row = $pending->fetch_assoc()) {
        $task = $util->rowToTask($row);
        $taskBase->setAsPending($task->id);
    }
}

class PDFWorkPool extends Pool
{
    public $data = array();


    public function process()
    {
        // Run this loop as long as we have
        // jobs in the pool
        while (count($this->workers)) {
            $this->collect(function (PDFWork $work) {
                // If a task was marked as done
                // collect its results
                if ($work->isComplete()) {
                    $tmpObj = new stdclass();
                    $tmpObj->complete = $work->isComplete();
                    $tmpObj->task = $work->getTask();
                    //this is how you get your completed data back out [accessed by $pool->process()]
                    $this->data[] = $tmpObj;
                }

                return $work->isComplete();
            });
            $conf = getConfig();;
            $util = new WorkUtil();
            $_log = new WorkLog($conf->log_file);
            $log_time = $util->logDate();
            $_log->print("\t\t\t+ $log_time this work is complete ");
        }
        // All jobs are done
        // we can shutdown the pool
        try {
            $this->shutdown();
        } catch (Exception $e) {
            $conf = getConfig();;
            $util = new WorkUtil();
            $_log = new WorkLog($conf->log_file);
            $log_time = $util->logDate();
            $_log->print("\t\t\t+ $log_time shutdown the pool ended with an exception!");
        }

        return $this->data;
    }
}


class ExecPDFConvertTask
{
    public function __construct($taskRow, PDFWorkPool $pool)
    {

        $conf = getConfig();;
        $util = new WorkUtil();
        $_log = new WorkLog($conf->log_file);
        //init
        $dbManager = new DBManager($conf, $util);
        $taskBase = new TaskBase($conf, $dbManager, $util);
        $fileBase = new FileBase($conf, $dbManager, $util);
        $docBase = new DocBase($conf, $dbManager, $util);
        $docPageBase = new DocPageBase($conf, $dbManager, $util);
        $taskBuilder = new PDFTaskBuilder($docBase, $fileBase,
            $docPageBase, $util, $conf->log_file);
        $generator = new ThumbGen();
        //exec
        if (empty($taskRow)) {
            $log_time = $util->logDate();
            $_log->print("\t$log_time [FATAL ERROR]. Bad taskRow given as argument." .
                " Aborting task execution request.");
        }

        $task = $taskBuilder->build($taskRow);
        $_log->print("\t" . $util->logDate() . " Starting new PDF-CONVERT job. Giving Task id" .
            " [" . $taskRow['id'] . "] to Doc [" . $task->doc->id . "]. The Pdf file for this job" .
            " exists database with File id [" . $task->pdfFile->id . "]");
        $log_time = $util->logDate();
        $_log->print("\t\t\t+ $log_time Working on pdf file: ");

        $_log->print("\t\t                - " . $task->pdfFile->full_path);
        $taskBase->setInQueue($task->id);
        $worker = new PDFWork();
        $worker->initWork($generator, $task, $taskBase);
        $pool->submit($worker);
//        $worker->start();
        $log_time = $util->logDate();
        $_log->print("\t\t\t+ $log_time A worker dedicated for this job." .
            " The job  will be ready at some point. Please be patient.");
    }

}

function scan()
{
    $conf = getConfig();
    $util = new WorkUtil();
    $_log = new WorkLog($conf->log_file);
    $dbManager = new DBManager($conf, $util);
    $taskBase = new TaskBase($conf, $dbManager, $util);
    $pool = new PDFWorkPool(6, PDFWork::class);

    $pending = $taskBase->findPending();
    while ($row = $pending->fetch_assoc()) {

        new ExecPDFConvertTask($row, $pool);
    }
//    $retArr = $pool->process(); //get all of the results
//    foreach ($retArr as $num => $doneWork) {
//        $log_time = date('Y-m-d H:i:s');
//        $_log->print("\t\t\t+ $log_time [$num] - task " . $doneWork->task->id . " is complete.");
//    }
}


//    sleep(2);
//}


//toPending();
//scan();

$conf = getConfig();
$util = new WorkUtil();
$_log = new WorkLog($conf->log_file);
$start_time = date('Y-m-d H:i:s');
$_log->print("getcwd is equal to " . dirname(__FILE__));
$_log->print("*\t\t\t\t\t\t\t*\n Pageshare TaskManager started from [Main] by direct script call at [$start_time]\n" .
    " Listening to incoming tasks...\n\t\t\t\t\t\t");

scan();
//while(true){
//    scan();
//    sleep(2);
//}