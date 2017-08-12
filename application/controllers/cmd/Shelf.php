<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Part of  Pageshare v1 and v2 server changes
 */
class Shelf extends CI_Controller
{

    function index()
    {

    }

    public function find()
    {
        $this->load->model('book');
        $this->load->model('DocModel');
        $shelf_id = $this->uri->segment(4);
        if(!empty($shelf_id)){
            $params = (object)[
                'logged_in' => $this->session->userdata('logged_in'),
                'resolution' => 300,
                'models' => models_for_legacy_convert($this),
                'docs' => $this->DocModel->findAllByOriginalCollection($shelf_id),
                'legacy_books' => $this->book->loadShelf($shelf_id)
            ];
            $docs = group_as_legacy($params);
            $res = (object)[
                'shelf_editable' => $this->session->userdata('logged_in'),
                'shelf_id' => $shelf_id,
                'docs' => $docs
            ];
        }else{
            $this->load->model('CollectionModel');
            $res = $this->CollectionModel->findAll();
        }
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($res,
                $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

}
/* End of file upload.php */
/* Location: ./application/controllers/admin/upload.php */
