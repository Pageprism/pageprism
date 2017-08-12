<?php

class MetaModel extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function saveOne($doc_id, $meta_key, $meta_value)
    {
//        log_message('debug', 'key ' . $doc_id);
//        log_message('debug', 'meta_key ' . $meta_key);
//        log_message('debug', 'meta_value ' . $meta_value);
        if (empty($doc_id) || empty($meta_key) || empty($meta_value)) {
            return false;
        }
        $key = $this->db->get_where('MetaKey', array('name' => $meta_key));
        if (empty($key->first_row())) {
            $this->db->insert("MetaKey", array('name' => $meta_key));
            $meta_id = $this->db->insert_id();
        } else {
            $meta_id = $key->first_row()->id;
        }
        $value = $this->db->get_where('MetaValue', array('key_id' => $meta_id, 'value' => $meta_value));
        if(empty($value->first_row())) {

            $this->db->insert("MetaValue", array('key_id' => $meta_id, 'value' => $meta_value));
            $value_id = $this->db->insert_id();
        } else {
            $value_id = $value->first_row()->id;
        }
        return $this->db->insert("Doc_MetaValue", array('doc_id' => $doc_id, 'metaValue_id' =>$value_id));
    }
    public function removeAll($doc_id){
        //only delete the link between doc and metas
        return $this->db->delete('Doc_MetaValue', array('doc_id' => $doc_id));
    }
    public function saveAll($doc_id, $meta_key, $meta_values)
    {
        $res = array('saved_count' => 0, 'failed_count' => 0, 'fail_messages' => array());
        $meta_values = is_array($meta_values) ? $meta_values : [$meta_values];
        foreach ($meta_values as $v) {
            try {
                $ok = $this->saveOne($doc_id, $meta_key, $v);
                if ($ok) {
                    $res['saved_count']++;
                } else {
                    $res['saved_count']--;
                    $res['failed_messages'][] = 'Not saved but no errors either, check the parameters passed in.';
                }

            } catch (mysqli_sql_exception $e) {
                $res['failed_count']++;
                $res['failed_messages'][] = $e;
            }
        }
        return $res;
    }

    public function saveGroup($doc_id, $meta_group)
    {
        $res = array();
        foreach ($meta_group as $key => $value) {
            $res['save_' . $key] = $this->saveAll($doc_id, $key, $value);
        }
        return $res;
    }


    public function findKeys()
    {
        $query = $this->db->query("SELECT * FROM MetaKey");
        $keys = $query->result();
        if (!$keys) return null;
        return $keys;
    }
    public function findAllKeys($doc_id)
    {
        $query = $this->db->query("SELECT MetaKey.id, MetaKey.name FROM MetaKey, MetaValue," .
            " Doc_MetaValue where Doc_MetaValue.doc_id = " . $doc_id .
            " and MetaKey.id = MetaValue.key_id" .
            " and MetaValue.id = Doc_MetaValue.metaValue_id");
        $keys = $query->result();
        if (!$keys) return null;
        return $keys;
    }

    public function findValues($key_id)
    {
        $query = $this->db->query("SELECT * FROM MetaValue where" .
            " MetaValue.key_id = " . $key_id);
        $values = $query->result();
        if (!$values) return null;
        return $values;
    }

    public function findAllValues($doc_id, $key_id)
    {
        $query = $this->db->query("SELECT MetaValue.id, MetaValue.value FROM MetaValue," .
            " Doc_MetaValue where Doc_MetaValue.doc_id = " . $doc_id .
            " and MetaValue.key_id = " . $key_id .
            " and MetaValue.id = Doc_MetaValue.metaValue_id");
        $values = $query->result();
        if (!$values) return null;
        return $values;
    }

    public function findKeyValuePairs()
    {
        $res = $this->findKeys();
        forEach($res as $ind => $key){
            $res[$ind] -> values = $this->findValues($key->id);
        }
        return $res;
    }

}
