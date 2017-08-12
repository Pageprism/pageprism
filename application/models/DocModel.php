<?php

class DocModel extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
//        $this->load->model('BookAttributes');
    }

    public function create($name, $owner_id, $shelf_id, $public, $allow_aggregating)
    {
        if (empty($name) || empty($owner_id)) {
            return -1;
        }
        $ok = $this->db->insert("Doc", array(
            'name' => $name,
            'owner_id' => $owner_id,
            'visibility' => $public,
            'allow_aggregating' => $allow_aggregating,
            'shelf' => $shelf_id,
            'original_collection' => $shelf_id
        ));
        if ($ok) {
            return $this->db->insert_id();
        } else {
            return -1;
        }
    }

    public function update($id, $name = null,
                           $shelf_id = null, $visibility = null,
                           $allow_aggregating = null)
    {
        $data = new stdClass();
        if (empty($id)) {
            return false;
        }
        if (!empty($name)) {
            $data->name = $name;
        }
        if (!empty($shelf_id)) {
            $data->shelf = $shelf_id;
            $data->original_collection = $shelf_id;
        }
        if ($visibility !== null) {
            $data->visibility = $visibility;
        }
        if ($allow_aggregating !== null) {
            $data->allow_aggregating = $allow_aggregating;
        }

        $this->db->where('id', $id);
        $this->db->update('Doc', $data);
        return true;
    }

    public function updateFile($doc_id, $file_id, $type, $ext)
    {
        if (empty($doc_id) || empty($file_id) || empty($type)) {
            return false;
        }
        $data = new stdClass();
        if ($type === "pdf" || $type === "application/pdf") {
            $data->pdf = $file_id;
        } elseif ($type === "epub" || $type === "application/epub" ||
            $type === "application/epub zip" || $type === "application/epub+zip"
        ) {
            $data->epub = $file_id;
        } else if ($type === "audio" ||
            ($ext === ".mp3" || $ext === ".wav" || $ext === ".ogg" || $ext === "wma")
        ) {
            $data->audio = $file_id;
        } else {
            return false;
        }
        $this->db->where('id', $doc_id);
        $ok = $this->db->update('Doc', $data);
        return $ok;
    }

    public function findAll()
    {
        $query = $this->db->query("SELECT * FROM Doc");
        $docs = $query->result();
//        $this->BookAttributes->loadInto($docs);
        if (!$docs) return null;
        return $docs;
    }

    public function findAllByShelf($id, $as_legacy = false)
    {
        $query = $this->db->query("SELECT * FROM Doc WHERE Doc.shelf=" . $id);
        $docs = $query->result();
        if (!$docs) return null;
        return $docs;
    }

    public function findAllByOriginalCollection($id)
    {
        $query = $this->db->query("SELECT * FROM Doc WHERE Doc.original_collection=" . $id);
        $docs = $query->result();
        if (!$docs) return null;
        return $docs;
    }

    public function findOneById($doc_id)
    {
        $query = $this->db->query("SELECT * FROM Doc WHERE Doc.id = ?", (int)$doc_id);
        $docs = $query->result();
//        $this->BookAttributes->loadInto($docs);
        if (!$docs) return null;
        return $docs[0];
    }

    public function findOneByName($name)
    {
        $query = $this->db->query("SELECT * FROM Doc WHERE Doc.name = ?", $name);
        $docs = $query->result();
//        $this->BookAttributes->loadInto($docs);
        if (!$docs) return null;
        return $docs[0];
    }

    public function hasAudio($id)
    {
        $query = $this->db->query("SELECT count(*) AS count FROM Audio WHERE doc_id = ?", $id);
        $res = $query->row();
        return (bool)($res->count) ? true : false;
    }

    public function getCoverPath($doc_id)
    {
        $doc = $this->findOneById($doc_id);
        $this->load->model('FileModel');
        if (empty($doc)) {
            return null;
        }
        $pdf_file = $this->FileModel->findOneById($doc->pdf);
        $cover_file = $pdf_file->path . '/cover.jpg';
        if (is_file($cover_file)) {
            return $cover_file;
        }
        return null;
    }

    public function remove($doc_id)
    {
        $doc = $this->findOneById($doc_id);
        if (empty($doc)) {
            return false;
        }
        $this->load->model('FileModel');
        $this->load->model('DocPageModel');
        $this->load->model('MetaModel');
        $fileModel = $this->FileModel;
        $docPageModel = $this->DocPageModel;
        $metaModel = $this->MetaModel;
        $pdf_file = $fileModel->findOneById($doc->pdf);
        $root_dir = $pdf_file->path;
        $res120_dir = $pdf_file->path . '/pages-120';
        $res300_dir = $pdf_file->path . '/pages-300';
        $cover_file = $pdf_file->path . '/cover.jpg';
        if (is_file($cover_file)) {
            unlink($cover_file);
        }
        $docPageModel->removeAllPages($doc_id, $fileModel);
        $metaModel->removeAll($doc_id);
        $this->db->delete('Task', array('doc_id' => $doc_id));
        $this->db->delete('Doc', array('id' => $doc_id));
        $fileModel->remove($doc->pdf);
        $fileModel->remove($doc->epub);
        $fileModel->remove($doc->audio);
        if (is_dir($res300_dir)) {
            rmdir($res300_dir);
        }
        if (is_dir($res120_dir)) {
            rmdir($res120_dir);
        }
        if (is_dir($root_dir)) {
            rmdir($root_dir);
        }

        return true;
    }

}
