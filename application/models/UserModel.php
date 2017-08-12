<?php

class UserModel extends CI_Model
{
    public function findAll()
    {
        $query_str = "SELECT user_id as id, user_email as email, user_name as name," .
            " user_date as date, user_modified as modified, user_last_login as last_login," .
            " main_collection FROM users";
        $query = $this->db->query($query_str);

        if ($query->num_rows() == 0) return array();

        return $query->result();
    }

    public function findOne($user_id)
    {
        $query_str = "SELECT user_id as id, user_email as email, user_name as name," .
            " user_date as date, user_modified as modified, user_last_login as last_login," .
            " main_collection FROM users where user_id=?";
        $query = $this->db->query($query_str, [$user_id]);

        if ($query->num_rows() == 0) return array();

        return $query->result();
    }

    public function create($name, $email, $password, $main_collection = null)
    {
        if (!(empty($name) && empty($email) && empty($password))) {
            $ok = $this->db->insert("users", array(
                'user_name' => $name,
                'user_email' => $email,
                'user_pass' => $password,
                'main_collection' => $main_collection
            ));
            if ($ok) {
                return $this->db->insert_id();
            }
        }
        return -1;
    }

    public function update($user_id, $data)
    {
        if (empty($user_id)) {
            return -1;
        }
        $converted_data = $this->convertPropertyNames($data);
        return $this->db->update('users', $converted_data, array("user_id" => $user_id));
    }

    public function remove($user_id)
    {
        if (empty($user_id)) {
            return false;
        }
        if ($this->findOne($user_id) && $this->db->delete("users", array("user_id" => $user_id))) {
            return true;
        }
        return false;
    }

    private function convertPropertyNames($data)
    {
        $converted = [];
        if (empty($data)) {
            return $converted;
        }
        foreach ($data as $p => $v) {
            if (in_array($p, ['name', 'email', 'pass'])) {
                $converted['user_' . $p] = $data[$p];
            } else if ($p === 'main_collection') {
                $converted['main_collection'] = $data[$p];
            }
        }
        return $converted;
    }
}
