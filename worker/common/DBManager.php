<?php

class DBManager
{
    //insert into Task (type,doc_id,status,level,started,ended) values ('pdf-convert',84,'pending',80,null,null);
    public function __construct($cnf,$workUtil)
    {
        $this->servername = $cnf->servername;
        $this->username = $cnf->username;
        $this->password = $cnf->password;
        $this->dbName = $cnf->dbName;
        $this->log = $cnf->log_file;
        $this->util = $workUtil;
    }

    private function work_log($msg)
    {
        return $this->util->work_log($msg, $this->log);
    }
    public function getMYSQLTime()
    {
        return date("Y-m-d H:i:s");
    }

    public function connect()
    {
        $servername = $this->servername;
        $username = $this->username;
        $password = $this->password;
        $dbName = $this->dbName;
        $conn = new mysqli($servername, $username, $password, $dbName);
        if ($conn->connect_error) {
            $con_msg = "connection failed";
            $this->work_log("\tDB Connection Error: $con_msg");
            die("Connection failed: " . $conn->connect_error);

        }
        return $conn;
    }
}

