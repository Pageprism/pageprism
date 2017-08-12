<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Restful API for Collection
 */
class CollectionAPI extends CI_Controller
{

    function index()
    {

    }

    public function get()
    {
        $vars = $this->getProcVars();
        $res = $vars['response'];
        $model = $vars['model'];
        $this->load->model('book');
        $this->load->model('DocModel');
        $collection_id = $this->uri->segment(3);
        $status = 404;
        if (!empty($collection_id) && $model->findOne($collection_id)) {
            $res = $model->findOne($collection_id);
            if (!empty($res) && count($res) > 0) {
                $this->attachDocs($res[0]);
            }
            $status = 200;

        } else if (empty($collection_id)) {
            $res = $model->findAll();
            foreach ($res as $c => $coll) {
                $this->attachDocs($coll);
            }
            $status = 200;
        }
        $this->setJSONResponse($res, $status);
    }


    public function post()
    {
        $vars = $this->getProcVars();
        $req = $vars['request'];
        $res = $vars['response'];
        $model = $vars['model'];
        $status = 400;
        $res->message = "Bad request.";
        $res->props = $this->input->raw_input_stream;
        if ($this->hasProperties($req, ["name", "owner_id", "type"])) {
            $newId = $model->create($req->name, $req->owner_id, $req->type);
            $res->newId = $newId;
            if ($newId >= 0) {
                $status = 202;
                $res->message = "Collection created";
            }
        }
        $this->setJSONResponse($res, $status);
    }

    public function delete()
    {
        $vars = $this->getProcVars();
        $req = $vars['request'];
        $res = $vars['response'];
        $model = $vars['model'];
        $collection_id = $this->uri->segment(3);
        $status = 400;
        $res->message = "Bad request. Collection does not exist. Nothing to remove";
        if (!empty($collection_id) && $model->remove($collection_id)) {
            $status = 202;
            $res->message = "Collection removed successfully.";
        }
        $this->setJSONResponse($res, $status);

    }

    public function put()
    {
        $vars = $this->getProcVars();
        $req = $vars['request'];
        $res = $vars['response'];
        $model = $vars['model'];
        $collection_id = $this->uri->segment(3);
        $status = 400;
        $res->message = "Bad request.";
        $collection = $model->findOne($collection_id);
        if (!empty($collection_id) && $collection) {
            $keyValues = $this->getAndMergeProperties($req, $collection, ["name", "owner_id", "type",
                "visibility", "version_id"]);
            $res->message = "Collections updated successfully [" . $model->update($collection_id, $keyValues) . "] ";
            $status = 202;
        }
        $this->setJSONResponse($res, $status);
    }

    //TODO: ---------------PRIVATE CODE TO BE MOVED IN SERVICE / LIBRARY LEVEL ------------------------------

    private function hasProperties($req, $props)
    {
        if (!empty($req)) {
            foreach ($props as $p) {
                if (!property_exists($req, $p)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    private function getAndMergeProperties($req, $collection, $props)
    {
        $keyValues = [];
        if (!empty($req)) {
            foreach ($props as $p) {
                if (property_exists($req, $p)) {
                    $keyValues[$p] = ((array)$req)[$p];
                } else if (!empty($collection) && is_array($collection) && count($collection) > 0) {
                    $keyValues[$p] = ((array)$collection[0])[$p];
                }
            }
        }
        return $keyValues;
    }

    private function getProcVars()
    {
        $stream_clean = $this->security->xss_clean($this->input->raw_input_stream);
        $req = json_decode($stream_clean);
        $this->load->model('CollectionModel');
        $model = $this->CollectionModel;
        $res = new stdClass();
        return array(
            'request' => $req,
            'model' => $model,
            'response' => $res
        );
    }

    private function setJSONResponse($res = ['msg' => 'no data'], $status = 200)
    {
        $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($res,
                $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    private function attachDocs($collection)
    {
        $this->load->model('book');
        $this->load->model('DocModel');
        $this->load->model('MetaModel');
        if (!empty($collection)) {
            $legacy_books = $this->book->loadShelf($collection->id);
            $docs = $this->DocModel->findAllByOriginalCollection($collection->id);
            if (!empty($docs) && count($docs) > 0) {
                foreach ($docs as $d) {
                    $d->doc_id = $d->id;
                    if (empty($d->file_url_cover)) {
                        $d->file_url_cover = '/cover/' . $d->doc_id;
                    }
                    if (empty($d->file_url_epub) && !empty($d->epub)) {
                        $d->file_url_epub = '/epub/' . $d->name . '/' . $d->epub;
                    }
                    if (empty($d->file_url_pdf) && !empty($d->pdf)) {
                        $d->file_url_pdf = '/pdf/' . $d->name . '/' . $d->pdf;
                    }

                    $d->id = 'doc-' . $d->id;
                    $d->attributes = meta_to_legacy($d->doc_id, $this->MetaModel);
                }
            }
            $collection->docs = $docs;
            if (!empty($legacy_books) && count($legacy_books)) {
                $collection->docs = !empty($docs) && count($docs) > 0 ? array_merge($docs, $legacy_books) : $legacy_books;
            }
        }
    }
}
/* End of file upload.php */
/* Location: ./application/controllers/admin/upload.php */
