<?php

class FileModel extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
//        $this->load->model('BookAttributes');
    }

    public function create($name, $path, $full_path, $ext, $raw_name, $type, $size)
    {
        if (empty($path) || empty($type) || empty($name)) {
            return -1;
        }
        $ok = $this->db->insert("File", array('path' => $path,
                'name' => $name,
                'type' => $type,
                'size' => $size,
                'ext' => $ext,
                'raw_name' => $raw_name,
                'type' => $type,
                'full_path' => $full_path
            )
        );
        if ($ok) {
            return $this->db->insert_id();
        } else {
            return -1;
        }
    }

    public function findAll()
    {
        $query = $this->db->query("SELECT * FROM File");
        $docs = $query->result();
//        $this->BookAttributes->loadInto($docs);
        if (!$docs) return null;
        return $docs;
    }

    public function findByType($type)
    {
        $query = $this->db->query("SELECT * FROM File WHERE File.type = ?", $type);
        $files = $query->result();
//        $this->BookAttributes->loadInto($docs);
        return $files;
    }

    public function findOneById($fileId, $secure = false)
    {
        $query = $this->db->query("SELECT * FROM File WHERE File.id = ?", (int)$fileId);
        $files = $query->result();
//        $this->BookAttributes->loadInto($docs);

        if (!$files) return null;
        return $secure == true ? $this->secureFileData($files[0]) :$files[0] ;
    }

    private function secureFileData($data)
    {
        if (!empty($data)) {
            $data->path = null;
            $data->full_path = null;
            $data->url = 'cmd/file/' . $data->id;
        }
        return $data;
    }

    public function findOneByLink($path, $name)
    {
        $query = $this->db->query("SELECT * FROM File WHERE File.path = " . $path . " and File.name = " . $name);
        $docs = $query->result();
//        $this->BookAttributes->loadInto($docs);
        if (!$docs) return null;
        return $docs[0];
    }

    public function remove($id)
    {
        $file = $this->findOneById($id);
        if (!empty($file)) {
            if (is_file($file->full_path)) {
                unlink($file->full_path);
            }
            return $this->db->delete('File', array('id' => $id));
        }
        return false;

    }

}
