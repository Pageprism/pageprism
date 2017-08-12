<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Part of  Pageshare v1 and v2 server changes
 */
class Meta extends CI_Controller
{

    function index()
    {

    }

    /**
     * Meta
     */
    public function save_meta()
    {
        $logged_in = require_login(true, $this);
        if (!$logged_in) {
            return;
        }

        $stream_clean = $this->security->xss_clean($this->input->raw_input_stream);
        $req = json_decode($stream_clean);
        $doc_id = $req->doc_id;
        $doc_meta = $req->doc_meta;
        $this->load->model('MetaModel');
        $this->MetaModel->removeAll($doc_id);
        $res = $this->MetaModel->saveGroup($doc_id, $doc_meta);
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($res, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    public function get_meta()
    {
        $doc_id = $this->uri->segment(4);
        $this->load->model('MetaModel');
        $res = array();
        if (!empty($doc_id)) {
            $keys = $this->MetaModel->findAllKeys($doc_id);
        }
        if (empty($keys)) $keys = array();

        foreach ($keys as $k) {

            $res[$k->name] = $this->MetaModel->findAllValues($doc_id, $k->id) ?? [];
        }
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($res, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    public function values()
    {
        $key_id = $this->uri->segment(4);
        $this->load->model('MetaModel');
        $values = $this->MetaModel->findValues($key_id);
        if (empty($values)) $values = array();
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($values, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    public function keys()
    {
        $this->load->model('MetaModel');
        $keys = $this->MetaModel->findKeys();
        if (empty($keys)) $keys = array();
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($keys, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    public function pairs()
    {
        $this->load->model('MetaModel');
        $keys = $this->MetaModel->findKeyValuePairs();
        if (empty($keys)) $keys = array();
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($keys, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }
}
/* End of file upload.php */
/* Location: ./application/controllers/admin/upload.php */
