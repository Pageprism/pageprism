<?php

class DocPageModel extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }


    public function findAllPagesByRes($doc_id, $res)
    {
        if (empty($res)) {
            $res = 300;
        }
        if (empty($doc_id)) {
            return [];
        }
        $sql = "select * from DocPage where doc_id=" . $doc_id . " and resolution=" . $res . " order by number";
        $query = $this->db->query($sql);
        $keys = $query->result();

        if (!$keys) return null;
        return $keys;
    }

    public function findAllPages($doc_id)
    {
        if (empty($doc_id)) {
            return [];
        }
        $sql = "select * from DocPage where doc_id=" . $doc_id . " order by number";
        $query = $this->db->query($sql);
        $pages = $query->result();
        if (!$pages) return null;
        return $pages;
    }

    public function removeAllPages($doc_id, $fileModel)
    {
        $pages = $this->findAllPages($doc_id);
        $this->db->delete('DocPage', array('doc_id' => $doc_id));
        foreach ($pages as $p) {
            $fileModel->remove($p->file_id);
        }
        return true;
    }


}
