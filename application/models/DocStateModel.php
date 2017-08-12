<?php

class DocStateModel extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function init($doc_id, $taskModel)
    {
        $this->TaskModel = $taskModel;
        $this->doc_id = $doc_id;
    }
    public function getState(){
        $doc_id = $this->doc_id;
        $taskModel = $this->TaskModel;
        $state = new stdClass();
        if(empty($doc_id)){
            $state->error = "undefined doc_id";
        }else{
            $state->doc_id = $doc_id;
            $state->is_busy = $taskModel->isDocBusy($doc_id);
            $state->is_active = $taskModel->isDocActive($doc_id);
            $state->is_pending = $taskModel->isDocPending($doc_id);
            $state->in_queue = $taskModel->isDocInQueue($doc_id);
            $state->is_done = $taskModel->isDocDone($doc_id);
        }
        return $state;
    }

}
