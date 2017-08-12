<?php


class TaskBase
{
    //insert into Task (type,doc_id,status,level,started,ended) values ('pdf-convert',84,'pending',80,null,null);
    public function __construct($cnf, $dbManager, $workUtil)
    {
        $this->db = $dbManager;
        $this->taskTable = $cnf->taskTable;
        $this->log = $cnf->log_file;
        $this->util = $workUtil;
    }

    private function work_log($msg)
    {
        return $this->util->work_log($msg, $this->log);
    }

    public function clean($time_str)
    {
        $conn = $this->db->connect();
        $table = $this->taskTable;
        if (($this->util->endsWith($time_str, "hour") ||
            $this->util->endsWith($time_str, "minutes"))
        ) {

            if ($this->util->startsWith($time_str, '-')) {
                $past = $time_str;
            } else {
                $past = '- ' . $time_str;
            }
            $dateFrom = date('Y-m-d H:i:s', strtotime($past));
            if ($conn->connect_error) {
                $result = null;
            } else {
                $sql = "DELETE FROM " . $table .
                    " WHERE (status='done' and ended < '" . $dateFrom .
                    "') or status='canceled'";
                $result = $conn->query($sql);
                $this->work_log("Who is calling clean??");
            }
            $conn->close();
        } else {
            $this->work_log("TaskBase: Task clean Failed. Task clean requires" .
                " a string arg which starts with a number prefix " .
                "and ends with 'hour' or 'minutes'.");
        }
    }

    public function createMockTasks($task, $amount)
    {
        for ($d = 0; $d <= $amount; $d++) {
            $nxt = new stdClass();
            $nxt->type = $task->type;
            $nxt->doc_id = $task->doc_id;
            $nxt->status = $task->status;
            $nxt->level = $task->level;
            $nxt->started = $task->started;
            $nxt->ended = $task->ended;
            $res = $this->createTask($nxt);
            work_log("\t\t** Mock task created: New id is ** " . $res);
        }
    }

    public function createPendingTask($task)
    {
        $task->status = 'pending';
        $task->started = null;
        $task->ended = null;
        $task->level = 0;
        return $this->createTask($task, true);
    }

    public function createTask($task, $skipTimes = false)
    {
        $conn = $this->db->connect();
        $table = $this->taskTable;

        if ($conn->connect_error) {
            $result = null;
        } else {
            if (empty($task->started)) {
                $task->started = date('Y-m-d H:i:s', null);
            }
            if (empty($task->ended)) {
                $task->ended = date('Y-m-d H:i:s', null);
            }
            if ($skipTimes == true) {
                $sql = "insert into " . $table .
                    " (type,doc_id,status,level) values" .
                    "('" . $task->type . "'," . $task->doc_id . ",'" .
                    $task->status . "'," . $task->level . ")";
            } else {
                $sql = "insert into " . $table .
                    " (type,doc_id,status,level,started,ended) values" .
                    "('" . $task->type . "'," . $task->doc_id . ",'" .
                    $task->status . "'," . $task->level . ",'" .
                    $task->started . "','" . $task->ended . "')";

            }

            $result = $conn->query($sql);
            $created_id = $conn->insert_id;
        }
        $conn->close();
        if ($result) {
            return $created_id;
        } else {
            $this->work_log("\t" . $this->util->logDate() .
                " Failed to create new task. ");
            return null;
        }
    }

    public function isDocBusy($doc_id)
    {
        $pending = $this->findPending();
        foreach ($pending as $task) {
            $task = (object)$task;
            if ($task->doc_id === $doc_id) {
                return true;
            }
        }
        $active = $this->findActive();
        foreach ($active as $task) {
            $task = (object)$task;
            if ($task->doc_id === $doc_id) {
                return true;
            }
        }
        $inQueue = $this->findInQueue();
        foreach ($inQueue as $task) {
//            $this->work_log(print_r($task));
            $task = (object)$task;
            if ($task->doc_id === $doc_id) {
                return true;
            }
        }
        return false;
    }

    public function isDocPending($doc_id)
    {
        $pending = $this->findPending();
        foreach ($pending as $task) {
            $task = (object)$task;
            if ($task->doc_id === $doc_id) {
                return true;
            }
        }
        return false;
    }

    public function isDocActive($doc_id)
    {

        $active = $this->findActive();
        foreach ($active as $task) {
            $task = (object)$task;
            if ($task->doc_id === $doc_id) {
                return true;
            }
        }
        return false;
    }

    public function isDocInQueue($doc_id)
    {
        $inQueue = $this->findInQueue();
        foreach ($inQueue as $task) {
            $task = (object)$task;
            if ($task->doc_id === $doc_id) {
                return true;
            }
        }
        return false;
    }

    public function isDocDone($doc_id)
    {
        $done = $this->findDone();
        $is_busy = $this->isDocBusy($doc_id);
        foreach ($done as $task) {
            $task = (object)$task;
            if ($task->doc_id === $doc_id) {
                return true;
            }
        }
        //if not in done and not busy then
        // it has no active state
        // so it should be considered as done
        return !$is_busy;
    }

    public function findPending()
    {
        $conn = $this->db->connect();
        $table = $this->taskTable;
        if ($conn->connect_error) {
            $result = null;

        } else {
            $sql = "SELECT * FROM " . $table .
                " WHERE status='pending'";
            $result = $conn->query($sql);
        }

        $conn->close();
        return $result;
    }

    public function findInQueue()
    {
        $conn = $this->db->connect();
        $table = $this->taskTable;
        if ($conn->connect_error) {
            $result = null;

        } else {
            $sql = "SELECT * FROM " . $table .
                " WHERE status='queue'";
            $result = $conn->query($sql);
        }

        $conn->close();
        return $result;
    }

    public function findActive()
    {
        $conn = $this->db->connect();
        $table = $this->taskTable;
        if ($conn->connect_error) {
            $result = null;

        } else {
            $sql = "SELECT * FROM " . $table . " WHERE status='active'";
            $result = $conn->query($sql);
        }
        $conn->close();
        return $result;
    }

    public function findDone()
    {
        $conn = $this->db->connect();
        $table = $this->taskTable;
        if ($conn->connect_error) {
            $result = null;

        } else {
            $sql = "SELECT * FROM " . $table . " WHERE status='done'";
            $result = $conn->query($sql);
        }
        $conn->close();
        return $result;
    }

    public function setAsActive($t_id)
    {
        $conn = $this->db->connect();
        $table = $this->taskTable;
        $logTime = $this->util->logDate();
        $this->work_log("\t\t\t+ $logTime Marking Task [" . $t_id . "] as 'active'...");
        if ($conn->connect_error) {
            $result = null;
        } else {
            $now = $this->db->getMYSQLTime();
            $sql = "UPDATE " . $table . " SET status='active', started='" .
                $now . "', ended=NULL WHERE id='" . $t_id . "'";
            $result = $conn->query($sql);
        }
        $this->work_log("\t\t\t\t- setAsActive returned [" . $result . "]");
        $conn->close();
        return $result;
    }

    public function setInQueue($t_id)
    {
        $conn = $this->db->connect();
        $table = $this->taskTable;
        $logTime = $this->util->logDate();
        $this->work_log("\t\t\t+ $logTime Marking task [" . $t_id . "] as 'queue'...");
        if ($conn->connect_error) {
            $result = null;
        } else {
            $sql = "UPDATE " . $table . " SET status='queue'," .
                " started=NULL, ended=NULL" .
                " WHERE id='" . $t_id . "'";
            $result = $conn->query($sql);
        }
        $this->work_log("\t\t\t\t- setInQueue returned [" . $result . "]");
        $conn->close();
        return $result;
    }

    public function setAsDone($t_id)
    {
        $conn = $this->db->connect();
        $table = $this->taskTable;
        $logTime = $this->util->logDate();
        $this->work_log("\t\t\t+ $logTime Marking Task [" . $t_id . "] as 'done'...");
        if ($conn->connect_error) {
            $result = null;
        } else {
            $now = $this->db->getMYSQLTime();
            $sql = "UPDATE " . $table . " SET status='done', ended='" .
                $now . "' WHERE id='" . $t_id . "'";
            $result = $conn->query($sql);
        }
        $this->work_log("\t\t\t\t- setAsDone returned [" . $result . "]");
        $conn->close();
        return $result;
    }

    public function setAsPending($t_id)
    {
        $conn = $this->db->connect();
        $table = $this->taskTable;
        $logTime = $this->util->logDate();
        $this->work_log("\t\t\t+ $logTime Marking Task [" . $t_id . "] as 'pending'...");
        if ($conn->connect_error) {
            $result = null;
        } else {
            $now = null;
            $sql = "UPDATE " . $table . " SET status='pending', started=NULL, ended=NULL" .
                " WHERE id='" . $t_id . "'";
            $result = $conn->query($sql);
        }
        $this->work_log("\t\t\t\t- setAsPending returned [" . $result . "]");
        $conn->close();
        return $result;
    }


}

