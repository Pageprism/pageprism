<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Part of  Pageshare v1 and v2 server changes
 */
class File extends CI_Controller
{

    function index()
    {
        $file_id = $this->uri->segment(2);
        $this->load->model('FileModel');
        if (!empty($file_id)) {
            $res = $this->FileModel->findOneById($file_id);
        }

        if (empty($res)) $res = array();
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($res, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }


    public function page()
    {
        $doc_id = $this->uri->segment(3);
        $resolution = $this->uri->segment(4);
        $this->load->model('DocPageModel');
        if (!empty($doc_id)) {
            $res = $this->DocPageModel->findAllPagesByRes($doc_id, $resolution);
        }

        if (empty($res)) $res = array();
        foreach ($res as $p) {
            $p->image = "image/" . $p->file_id;
        }
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($res, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    public function cover()
    {
        $doc_id = $this->uri->segment(2);
        $this->load->model('DocModel');
        if (!empty($doc_id)) {
            $res = $this->DocModel->getCoverPath($doc_id);
        }
        if(!empty($res)){
            $content = file_get_contents($res);
            $status = 200;
        }else{
            $status = 404;
            $content = "";
        }
        $this->output
            ->set_status_header($status)
            ->cache(120)
            ->set_header("Pragma: cache")
            ->set_header("Cache-Control: public")
            ->set_content_type('image/jpeg')
            ->set_output($content);
    }

    public function image()
    {
        $file_id = $this->uri->segment(2);
        $this->load->model('FileModel');
        if (!empty($file_id)) {
            $res = $this->FileModel->findOneById($file_id);
        }
        if (empty($res)) $res = array();
        $this->output
            ->set_status_header(200)
            ->cache(120)
            ->set_header("Pragma: cache")
            ->set_header("Cache-Control: public")
            ->set_content_type('image/png')
            ->set_output(file_get_contents($res->full_path));
    }

    public function pdf()
    {
        $file_id = $this->uri->segment(3);
        $this->load->model('FileModel');
        if (!empty($file_id)) {
            $res = $this->FileModel->findOneById($file_id);
        }
        if (empty($res)) $res = array();
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/pdf')
            ->set_output(file_get_contents($res->full_path));
    }

    public function epub()
    {
        $file_id = $this->uri->segment(3);
        $this->load->model('FileModel');
        if (!empty($file_id)) {
            $res = $this->FileModel->findOneById($file_id);
        }
        if (empty($res)) {
            $this->output
                ->set_status_header(404)
                ->set_content_type('application/epub+zip')
                ->set_header('Content-Disposition: attachment; filename="emptyfile.epub"')
                ->set_output("No Epub File found!");
        } else {
            $this->output
                ->set_status_header(200)
                ->set_content_type('application/epub+zip')
                ->set_header('Content-Disposition: attachment; filename="' . $res->name . '"')
                ->set_output(file_get_contents($res->full_path));
        }


    }

}
/* End of file upload.php */
/* Location: ./application/controllers/admin/upload.php */
