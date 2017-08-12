<?php



class TaskModel extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function init($conf)
    {
        $workUtil = new WorkUtil();
        $dbManager = new DBManager($conf,$workUtil);
        return new TaskBase($conf, $dbManager,$workUtil);
    }

}
