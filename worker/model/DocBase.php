<?php

class DocBase
{
    //insert into Task (type,doc_id,status,level,started,ended) values ('pdf-convert',84,'pending',80,null,null);
    public function __construct($cnf, $dbManager, $workUtil = null)
    {
        $this->db = $dbManager;
        $this->docTable = $cnf->docTable;
        $this->log = $cnf->log_file;
        $this->util = $workUtil;
    }

    private function work_log($msg)
    {
        if (empty($util)) {
            return false;
        }
        return $this->util->work_log($msg, $this->log);
    }

    public function findOne($docId)
    {
        $conn = $this->db->connect();
        $table = $this->docTable;
        if ($conn->connect_error) {
            $result = null;

        } else {
            $sql = "SELECT * FROM " . $table .
                " WHERE id=" . $docId;
            $result = $conn->query($sql);
        }

        $conn->close();
        return $result;
    }
}

