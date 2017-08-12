<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Part of  Pageshare v1 and v2 server changes
 */
class Doc extends CI_Controller
{
    function index()
    {

    }

    function remove()
    {
        $logged_in = require_login(true, $this);
        if (!$logged_in) {
            return;
        }
        $doc_id = $this->uri->segment(4);
        $confirm = $this->input->post('confirm');

        /*
         * the data ca arrive also in form of JSON
         */
        if (empty($confirm)) {
            $stream_clean = $this->security->xss_clean($this->input->raw_input_stream);
            $req = json_decode($stream_clean);
            $confirm = $req->confirm;
        }

        if ($confirm === 'true' || $confirm === true) {
            $this->load->model('DocModel');
            $status = 202;
            $res = (object)[
                'status' => 'accepted',
                'result' => $this->DocModel->remove($doc_id)
            ];
        } else {
            $status = 403;
            $res = (object)[
                'status' => 'Forbidden',
                'error' => 'This action must be confirmed in order to proceed!'
            ];
        }
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($res, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    function legacy_remove()
    {
        $id = $this->uri->segment(4);
        $res = new stdClass();
        if (is_numeric($id) == true) {
            $query = $this->db->query("SELECT * FROM book WHERE `id`=$id");
            if ($query->num_rows() > 0) {
                $data = $query->row();
                $files_to_remove = array();

                if (strlen($data->file_url_pdf) > 0) {
                    $files_to_remove[] = $_SERVER['DOCUMENT_ROOT'] . "/" . $data->file_url_pdf;
                }
                if (strlen($data->file_url_epub) > 0) {
                    $files_to_remove[] = $_SERVER['DOCUMENT_ROOT'] . "/" . $data->file_url_epub;
                }
                if (strlen($data->file_url_cover) > 0) {
                    $files_to_remove[] = $_SERVER['DOCUMENT_ROOT'] . "/" . $data->file_url_cover;
                }

                $pdfquery = $this->db->query("SELECT * FROM pdf WHERE `book_id`=$data->id");
                foreach ($pdfquery->result_array() as $pdfrun) {
                    $files_to_remove[] = $_SERVER['DOCUMENT_ROOT'] . "/" . $pdfrun['page_image_url'];
                    $this->db->delete('pdf', array('id' => $pdfrun['id']));
                }

                $audioquery = $this->db->query("SELECT * FROM audio_file WHERE `book_id`=$data->id");
                foreach ($audioquery->result_array() as $audiofile) {
                    $files_to_remove[] = $_SERVER['DOCUMENT_ROOT'] . "/" . $audiofile['audio_file_url'];
                    $this->db->delete('audio_file', array('id' => $audiofile['id']));
                }

                $dirs_to_remove = array();
                foreach ($files_to_remove as $file_to_remove) {
                    $dir = dirname($file_to_remove);
                    unlink($file_to_remove);
                    $dirs_to_remove[$dir] = true;
                }
                $dirs_to_remove = array_keys($dirs_to_remove);
                sort($dirs_to_remove);
                while ($dir = array_pop($dirs_to_remove)) {
                    $isDirEmpty = !(new \FilesystemIterator($dir))->valid();
                    if ($isDirEmpty) {
                        rmdir($dir);
                    }
                }

                if ($this->db->delete('book', array('id' => $id)) == true) {
                    $res->msg = 'Document deleted!';
                }
                $status = 202;
                $res->status = 'accepted';
                $res->result = true;


            } else {
                $status = 400;
                $res->status = 'bad request';
                $res->result = false;
                $res->error = 'ID Error[ ' . $this->uri->segment(4) . ']';
            }

        }
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($res, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    function state()
    {
        $doc_id = $this->uri->segment(4);
        $taskCnf = get_worker_config();
        $this->load->model('TaskModel');
        $this->load->model('DocStateModel');
        $this->TaskModel = $this->TaskModel->init($taskCnf);
        $this->DocStateModel->init($doc_id, $this->TaskModel);
        $res = $this->DocStateModel->getState();
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($res, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }


    function find_one()
    {

        $id = $this->uri->segment(4);
        $this->load->model("DocModel");
        $this->load->model("FileModel");
        $res = $this->DocModel->findOneById($id);
        if (empty($res)) {
            $res = (object)[];
        } else {
            $res->pdfFile = !empty($res->pdf) ? $this->FileModel->findOneById($res->pdf, true) : null;
            $res->epubFile = !empty($res->epub) ? $this->FileModel->findOneById($res->epub, true) : null;
            $res->audioFile = !empty($res->audio) ? $this->FileModel->findOneById($res->audio, true) : null;
        }
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($res, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    function find_all()
    {

        $shelf_id = $this->uri->segment(4);
        $this->load->model("DocModel");
        if (!empty($shelf_id)) {
            $res = $this->DocModel->findAllByShelf($shelf_id);
        } else {
            $res = $this->DocModel->findAll();
        }

        if (empty($res)) {
            $res = array();
        } else {
            foreach ($res as $doc) {
                $doc->pdfFile = !empty($doc->pdf) ? $this->FileModel->findOneById($doc->pdf, true) : null;
                $doc->epubFile = !empty($doc->epub) ? $this->FileModel->findOneById($doc->epub, true) : null;
                $doc->audioFile = !empty($doc->audio) ? $this->FileModel->findOneById($doc->audio, true) : null;
            }
        }
        $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode($res, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    public function init()
    {
        $logged_in = require_login(true, $this);
        if (!$logged_in) {
            return;
        }
        $this->load->model("DocModel");
        $doc_name = $this->input->post("doc_name");
        $user_id = $this->input->post("user_id");
        $shelf_id = $this->input->post("shelf_id");
        $public = $this->input->post("public");
        $allow_aggregating = $this->input->post("allow_aggregating");
        $res = $this->DocModel->create($doc_name, $user_id, $shelf_id, $public, $allow_aggregating);
        $status = 200;
        $message = "An empty Doc initialized ";
        if ($res === -1) {
            $status = 400;
            $message = "Failed to initialize an empty Doc. Please check your POST variables 
            A user_id and a doc_name variables are required";
        }
        $data = (object)['doc_id' => $res,
            'message' => $message];
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($data, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    public function update()
    {
        $logged_in = require_login(true, $this);
        if (!$logged_in) {
            return;
        }

        $this->load->model("DocModel");
        $doc_id = $this->input->post("doc_id");
        $doc_name = $this->input->post("doc_name");
        $shelf_id = $this->input->post("shelf_id");
        if (!empty($this->input->post("original_collection"))) {
            $shelf_id = $this->input->post("original_collection");
        }
        $public = $this->input->post("public");
        $allow_aggregating = $this->input->post("allow_aggregating");
        $res = $this->DocModel->update($doc_id,
            $doc_name, $shelf_id, $public,
            $allow_aggregating);
        $status = 200;
        $message = "An empty Doc initialized ";
        if ($res !== true) {
            $status = 400;
            $message = "Failed to update Doc. Please check your POST variables 
            A user_id and a doc_name variables are required";
        }
        $data = (object)['doc_id' => $res,
            'message' => $message];
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($data,
                $this->input->is_ajax_request() ?
                    0 : JSON_PRETTY_PRINT));
    }

    public function upgrade_legacy()
    {
        $logged_in = require_login(true, $this);
        if (!$logged_in) {
            return;
        }
        $data = new stdClass();
        $doc_id = $this->input->post('doc_id');
        if (empty($doc_id)) {
            $status = 400;
            $data->error = "A valid doc_id is required!";

        } else {
            $this->load->model("FileModel");
            $this->load->model("DocModel");
            $fileModel = $this->FileModel;
            $docModel = $this->DocModel;
            $pdf_path = $this->input->post('pdf_path');
            $epubPath = $this->input->post('epub_path');
            $audioPath = $this->input->post('audio_path');
            $newRootPath = getcwd() . "/" . UPLOADS . date("Y/m/d") . "/DOC_" . $doc_id . "/";
            log_message('debug', '*****upgrading legacy files***** path is : ' . $pdf_path);
            if (!file_exists($newRootPath)) {
                mkdir($newRootPath, 0777, true);
            }
            if (!(empty($pdf_path) || $pdf_path === "null")) {
                $pdfParts = explode('/', $pdf_path);
                $newPdfPath = $newRootPath . '/' . $pdfParts[count($pdfParts) - 1];
                $newPdfFile = new SplFileInfo($newPdfPath);
                $pdfCpRes = copy($pdf_path, $newPdfPath);
                $data->pdf_copy = $pdfCpRes;
                $data->pdfInfo = get_file_info($newPdfPath);
                upgrade_file($docModel, $fileModel, $doc_id, $newPdfPath, 'application/pdf');
            }
            if (!(empty($epubPath) || $epubPath === "null")) {
                $epubParts = explode('/', $epubPath);
                $newEpubPath = $newRootPath . '/' . $epubParts[count($epubParts) - 1];
                $epubCpRes = copy($epubPath, $newEpubPath);
                $data->epub_copy = $epubCpRes;
                $data->epubInfo = get_file_info($newEpubPath);
                upgrade_file($docModel, $fileModel, $doc_id, $newEpubPath, 'application/epub');
            }
            if (!(empty($audioPath) || $audioPath === "null")) {
                $audioParts = explode('/', $audioPath);
                $newAudioPath = $newRootPath . '/' . $audioParts[count($audioParts) - 1];
                $audioCpRes = copy($audioPath, $newAudioPath);
                $data->audio_copy = $audioCpRes;
                $data->audioInfo = get_file_info($newAudioPath);
                upgrade_file($docModel, $fileModel, $doc_id, $newAudioPath, 'audio');
            }
            if ((!empty($newPdfFile) && $newPdfFile->isFile())) {
                /**
                 * Creating pdf-convert task for worker manager
                 */
                log_message('debug', 'Starting the convert job ' . $newPdfFile->getRealPath());
                $this->load->model('TaskModel');
                $task_cnf = get_worker_config();
                $env_cnf = get_env_config();
                convert_pdf($doc_id, $this->TaskModel, $task_cnf, $env_cnf);
            }
            $status = $pdfCpRes ? 202 : 501;
        }


        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($data, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }


    /**
     * uploading a file and generating a db entry for that file. Following the legacy code there are
     * three options for a file pdf, epub and mp3. This version introduced an audio table instead
     * of audio_file model.
     * Note: The idea of current version, is for the most part about keeping
     * the legacy (shitty) model unchanged, and adding better design around it. Later the legacy model will
     * be removed totally and there will be more flexibility.
     */

    public function upload()
    {
        $logged_in = require_login(true, $this);
        if (!$logged_in) {
            return;
        }
        $doc_id = $this->input->post('doc_id');
        $this->load->model("DocModel");
        $doc = $this->DocModel->findOneById($doc_id);
        if (empty($doc)) {
            $this->output
                ->set_status_header(400)
                ->set_content_type('application/json')
                ->set_output(json_encode((object)['message' => 'DOC data not found. A fie can be uploaded to an existence doc. Create a Doc first.'], $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
        } else {
            $path = getcwd() . "/" . UPLOADS . date("Y/m/d") . "/DOC_" . $doc_id . "/";
            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }
            $config['upload_path'] = $path;
            /**
             * The proper list can be something like the below list:
             * $config['allowed_types'] = 'epub|gif|jpg|png|pdf|mp3|epub|zip
             * |mp3|ogg|flac|alac|wav|mp4|zip|gz|tar.gz
             * |wmv|mp4b|raw|m4b|spx|aac|vox|amr|3ga|aa|asx|efa
             * |rma|orc|rmx|ima4|rmj|m2a|mp1|mp2|mpga|mg4';
             *
             * During the development all file types are good to be allowed.
             */
            $config['allowed_types'] = '*';
            $config['xss_clean'] = FALSE;
            $config['remove_spaces'] = TRUE;
            $this->upload->initialize($config);
            $status = 200;
            if (!$this->upload->do_upload('client_file')) {
                $error = array('error' => $this->upload->display_errors());
                $data = $error;
                $status = 400;
            } else {
                $this->load->model("FileModel");
                $this->load->model("DocModel");

                $data = $this->upload->data();
                upgrade_file_from_data($this->DocModel, $this->FileModel, $doc_id, $data);
                $file_ext = $data['file_ext'];
                if ($file_ext === '.pdf') {
                    /**
                     * Creating pdf-convert task for worker manager
                     */
                    $this->load->model('TaskModel');
                    $task_cnf = get_worker_config();
                    $env_cnf = get_env_config();
                    convert_pdf($doc_id, $this->TaskModel, $task_cnf, $env_cnf);
                }
            }
            $this->output
                ->set_status_header($status)
                ->set_content_type('application/json')
                ->set_output(json_encode($data, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
        }

    }

    //test legacy with http://localhost/bookController/book_info?id=164
    // test doc to legacy http://localhost/cmd/doc/doc_to_legacy?doc_id=117

    public function doc_info()
    {
        $id = $this->input->post_get('id');
        $doc_id = $this->input->post_get('doc_id');
        log_message('debug', 'legacy redirect for id ' . $id);
        if ($id) {
            redirect('bookController/book_info?id=' . $id);
        }
        if ($doc_id) {
            redirect('cmd/doc/to_legacy?doc_id=' . $doc_id);
        }
    }

    public function shelf_to_legacy()
    {
        $this->load->model('book');
        $this->load->model('DocModel');
        $shelf_id = $this->input->post_get('shelf_id');
        $params = (object)[
            'logged_in' => $this->session->userdata('logged_in'),
            'resolution' => 300,
            'models' => models_for_legacy_convert($this),
            'docs' => $this->DocModel->findAllByShelf($shelf_id),
            'legacy_books' => $this->book->loadShelf($shelf_id)
        ];
        $shelf = group_as_legacy($params);
        $status = 200;
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($shelf, $this
                ->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    public function to_legacy()
    {
        $this->load->model("DocModel");
        $this->load->model("FileModel");
        $models = models_for_legacy_convert($this);
        $logged_in = $this->session
                ->userdata('user_name') != "";
        $doc_id = $this->input
            ->post_get('doc_id');
        $doc = $this->DocModel
            ->findOneById($doc_id);
        if (empty($doc_id)) {
            $status = 400;
            $data = [
                'status' => 'bad request',
                'error' => 'specify the doc_id variable please!',
            ];
        } else if (empty($doc)) {
            $status = 400;
            $data = [
                'status' => 'not found!',
            ];
        } else {
            $resolution = 300;
            $status = 200;
            $data = load_as_legacy($models, $doc_id, $resolution, $logged_in);
            $data->book->pdfFile = !empty($data->book->pdf) ? $this->FileModel->findOneById($data->book->pdf, true) : null;
            $data->book->epubFile = !empty($data->book->epub) ? $this->FileModel->findOneById($data->book->epub, true) : null;
            $data->book->audioFile = !empty($data->book->audio) ? $this->FileModel->findOneById($data->book->audio, true) : null;
        }
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($data, $this
                ->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

}
/* End of file upload.php */
/* Location: ./application/controllers/admin/upload.php */
