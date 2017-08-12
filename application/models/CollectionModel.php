<?php

class CollectionModel extends CI_Model
{

    public function findAll()
    {
        $user_id = $this->session->userdata("user_id");
        //$query_str = "SELECT * FROM Collection WHERE visibility='public' OR owner_id=?";
        //moving the authorization settings to service level
        $query_str = "SELECT * FROM Collection";
        $query = $this->db->query($query_str, [$user_id]);

        if ($query->num_rows() == 0) return array();

        return $query->result();
    }

    public function findOne($col_id)
    {
//        $user_id = $this->session->userdata("user_id");
        //$query_str = "SELECT * FROM Collection WHERE id=? AND( visibility='public' OR owner_id=?)";
        //moving the authorization settings to service level
        $query_str = "SELECT * FROM Collection WHERE id=?";
        $query = $this->db->query($query_str, [$col_id]);

        if ($query->num_rows() == 0) return array();

        return $query->result();
    }

    public function create($name, $owner_id, $type = null)
    {
        if (!(empty($name) && empty($owner_id))) {
            $ok = $this->db->insert("Collection", array(
                'name' => $name,
                'owner_id' => $owner_id,
                'type' => $type));
            if ($ok) {
                return $this->db->insert_id();
            }
        }
        return -1;
    }

    public function update($coll_id, $data)
    {
        return $this->db->update('Collection', $data, array("id" => $coll_id));
    }

    public function remove($coll_id)
    {
        if (empty($coll_id)) {
            return false;
        }
        $this->db->update('Doc', array("original_collection" => null), array("original_collection" => $coll_id));
        $this->db->delete('CollectionShelf', array("collection_id" => $coll_id));
        if ($this->findOne($coll_id) && $this->db->delete("Collection", array("id" => $coll_id))) {
            return true;
        }
        return false;
    }

    //departed remove it through proper refactoring
    public function setMainCollectionForUser($user_id, $main_id)
    {
        $res = (object)[
            "success" => false,
            "status" => 404,
        ];
        $coll = $this->db->query("SELECT * FROM Collection WHERE id ='" . $main_id . "'")->result_array();
        $found = count($coll);
        if (!($found < 1 || empty($user_id) || empty($main_id))) {
            if ($coll[0]['owner_id'] === $user_id) {
                $data = array(
                    'main_collection' => $main_id,
                );
                $this->db->where('user_id', $user_id);
                $res->success = $this->db->update('users', $data);
                $res->status = $res->success === true ? 202 : 501;
                $res->status_message = $res->status === 202 ? "Main collection set." : "Failed to set main collection for user.";
            } else {
                $res->status = 403;
                $res->status_message = "User is not authorized for performing this action";

            }

            $res->collections_found = $found;
        }
        if (empty($user_id)) {
            $res->status = 403;
            $res->status_message = "User is not authorized for performing this action";
        }
        return $res;
    }

}
