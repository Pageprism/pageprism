<?php

class FileBase
{
    //insert into Task (type,doc_id,status,level,started,ended) values ('pdf-convert',84,'pending',80,null,null);
    public function __construct($cnf, $dbManager, $workUtil = null)
    {
        $this->db = $dbManager;
        $this->fileTable = $cnf->fileTable;
        $this->log = $cnf->log_file;
        $this->util = $workUtil;
    }

    private function work_log($msg)
    {
        if (empty($this->util)) {
            return false;
        }
        return $this->util->work_log($msg, $this->log);
    }

    public function findOne($fileId)
    {
        $conn = $this->db->connect();
        $table = $this->fileTable;
        if ($conn->connect_error) {
            $result = null;

        } else {
            $sql = "SELECT * FROM " . $table .
                " WHERE id=" . $fileId;
            $result = $conn->query($sql);
        }
        $conn->close();
        return $result;
    }

    public function create($fileInfo)
    {
        $conn = $this->db->connect();
        $name = $fileInfo->name;
        $path = $fileInfo->path;
        $full_path = $fileInfo->full_path;
        $ext = $fileInfo->ext;
        $raw_name = $fileInfo->raw_name;
        $type = $fileInfo->type;
        $size = $fileInfo->size;
        
        if (empty($path) || empty($type) || empty($name)) {
            return -1;
        }

        $sql = "insert into " . $this->fileTable .
            " (name,path,full_path,type,ext,raw_name,size)".
            " values('$name','$path','$full_path','$type','$ext','$raw_name',size)";
        $result = $conn->query($sql);
        $created_id = $conn->insert_id;

        $conn->close();
        if ($result) {
            return $created_id;
        } else {
            $this->work_log("\t".$this->util->logDate().
                " Failed to create new task. ");
            return null;
        }

    }
}






