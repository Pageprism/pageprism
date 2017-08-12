<?php

class AwrSerialModel extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
//        $this->load->model('BookAttributes');
    }

    public function insertSet($set = [])
    {
        $count = 0;
        foreach ($set as $nxt) {
            if ($this->isValidInsert($nxt) && !$this->keyExist($nxt->group, $nxt->key)) {
                $ok = $this->db->insert("AwrSerial", array(
                    'group' => $nxt->group,
                    'key' => $nxt->key,
                    'status' => 'valid-key',
                    'mode' => 'BasicPrime AD'
                ));
                if ($ok) {
                    $count++;
                }
            }
        }
        $this->setExpireDateForNewKeys();
        return $count;
    }

    public function findAllByGroup($group)
    {
        if (empty($group)) {
            return Array();
        }
        $query = $this->db->get_where("AwrSerial", array('group' => $group));
        return $query->result();
    }

    public function findOneById($group, $key)
    {
        if (empty($group) || empty($key)) {
            return null;
        }
        $query = $this->db->get_where("AwrSerial", array('group' => $group, 'key' => $key));
        $res = $query->result();
        if ($res) {
            return $res[0];
        }
        return null;
    }

    public function keyExist($group, $key)
    {
        $query = $this->db->query("SELECT * FROM AwrSerial WHERE" .
            " AwrSerial.key='" . $key . "' AND AwrSerial.group='" . $group . "'");
        $res = $query->result();
        return !$res ? false : true;

    }

    public function updateStatus($group, $key, $status)
    {
        if ($this->keyExist($group, $key) && !$this->isKeyExpired($group, $key) && !empty($status)) {
            if ($status === "expired" || $status === "expired-key") {
                $query = $this->db->query("UPDATE AwrSerial " .
                    "SET AwrSerial.expires=CURRENT_DATE, AwrSerial.status='" . $status . "' " .
                    "where AwrSerial.key='" . $key . "' and AwrSerial.group='" . $group . "'");
            } else {
                $query = $this->db->query("UPDATE AwrSerial " .
                    "SET AwrSerial.status='" . $status . "' where AwrSerial.key='" .
                    $key . "' and AwrSerial.group='" . $group . "'");
            }
            $this->db->set($query);
        }
    }

    public function isKeyExpired($group, $key)
    {
        if (empty($group) || empty($key)) {
            return true;
        }
        $this->findAndSetExpiredKeys();
        $query = $this->db->get_where("AwrSerial", array('group' => $group, 'key' => $key));
        $item = $query->result()[0];
        if (!empty($item)) {
            return $item->status === "expired" || $item->status === "expired-key";
        }
        return true;

    }

    private function findAndSetExpiredKeys()
    {
        $ok = $query = $this->db->query("UPDATE AwrSerial " .
            "SET AwrSerial.status='expired-key' " .
            " WHERE AwrSerial.expires <= CURRENT_DATE");
        return $ok;
    }

    private function setExpireDateForNewKeys($expire_days = 10)
    {
         $ok= $this->db->query("UPDATE AwrSerial " .
            "SET AwrSerial.expires=DATE_ADD(NOW(), INTERVAL " . $expire_days . " DAY) " .
            " WHERE AwrSerial.expires is NULL and (AwrSerial.status='valid-key' or AwrSerial.status='reserved-key')");
        return $ok;
    }

    private function isValidInsert($item)
    {
        return !empty($item) && !empty($item->group) && !empty($item->key);
    }
}
