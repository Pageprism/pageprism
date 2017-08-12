<?php

class DocPageBase
{
    //insert into Task (type,doc_id,status,level,started,ended) values ('pdf-convert',84,'pending',80,null,null);
    public function __construct($cnf, $dbManager, $workUtil = null)
    {
        $this->db = $dbManager;
        $this->table = $cnf->docPageTable;
        $this->log = $cnf->log_file;
        $this->util = $workUtil;
    }

    private function work_log($msg)
    {
        if (empty($workUtil)) {
            return false;
        }
        return $this->util->work_log($msg, $this->log);
    }

    public function insertPage($pageInfo)
    {
        $conn = $this->db->connect();
        $table = $this->table;

        $doc_id = $pageInfo->doc_id;
        $file_id = $pageInfo->file_id;
        $number = $pageInfo->number;
        $height = $pageInfo->height;
        $width = $pageInfo->width;
        $resolution = $pageInfo->resolution;

        $sql = "insert into " . $table .
            " (doc_id,file_id,number,height,width,resolution)" .
            " values ($doc_id,$file_id,$number,$height,$width,$resolution)";

        $result = $conn->query($sql);
        $created_id = $conn->insert_id;
        if ($result) {
            return $created_id;
        } else {
            $this->work_log("\t" . $this->util->logDate() .
                " Failed to create new DocPage entry for doc[$doc_id].");
            return null;
        }
    }
}

