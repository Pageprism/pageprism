<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 5.1.6 or newer
 *
 * @package      CodeIgniter
 * @author       EllisLab Dev Team
 * @copyright    Copyright (c) 2006 - 2011, EllisLab, Inc.
 * @license      http://codeigniter.com/user_guide/license.html
 * @link         http://codeigniter.com
 * @since        Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * Legacy_helper
 *
 * This helper Support legacy view and converts data based on the new model
 * to old structure.
 */

if (!function_exists('group_as_legacy')) {
    function group_as_legacy($params)
    {
        $shelf = [];
        $simple_view = true;
        if (!empty($params->legacy_books)) {
            foreach ($params->legacy_books as $book) {
                $shelf[] = $book;
            }
        }
        if (!empty($params->docs)) {
            foreach ($params->docs as $doc) {
                $shelf[] = load_as_legacy($params->models, $doc->id,
                    $params->resolution, $params->logged_in, $simple_view);
            }
        }
        return $shelf;
    }
}


if (!function_exists('load_as_legacy')) {
    function load_as_legacy($models, $doc_id,
                            $resolution, $logged_in, $simple_view = false)
    {
        $doc = $models->DocModel->findOneById($doc_id);
        $params = (object)[
            'doc' => $doc,
            'doc_id' => $doc->id,
            'pdf' => $doc->pdf,
            'epub' => $doc->epub,
            'audio' => $doc->audio,
            'DocPageModel' => $models->DocPageModel,
            'resolution' => $resolution,
            'MetaModel' => $models->MetaModel,
            'Shelf_model' => $models->Shelf_model,
            'TaskModel' => $models->TaskModel,
            'logged_in' => $logged_in,
            'simple_view' => $simple_view
        ];
        return wrap_as_legacy($params);
    }
}
if (!function_exists('wrap_as_legacy')) {
    function wrap_as_legacy($params)
    {
        $doc = $params->doc;
        $isDocBusy = $params->TaskModel->isDocBusy($doc->id);
        $pages = [];
        if (!$isDocBusy) {
            $pages = $params->DocPageModel
                ->findAllPagesByRes($params->doc_id,
                    $params->resolution);
            $legacy_pages = page_to_legacy($pages);
            $file_paths = extract_file_paths($doc);
        } else {
            $legacy_pages = busy_page_to_legacy();
            $file_paths = extract_file_paths($doc);
        }
        $shelf = $params->Shelf_model->getShelf($doc->shelf);
        $meta = meta_to_legacy($params->doc_id, $params->MetaModel);
        $book = doc_to_legacy($doc, $file_paths, $meta, count($pages));
        $book->isBusy = $isDocBusy;
        $book->pdf = $params->pdf;
        $book->epub = $params->epub;
        $book->audio = $params->audio;
        if (!empty($params->simple_view) || $params->simple_view === true) {
            $data = $book;
        } else {
            $data = (object)[
                'status' => 'success',
                'book' => $book,
                'collections' => [$shelf],
                'editable' => $params->logged_in,
                'pages' => $legacy_pages
            ];
        }
        return $data;
    }
}

if (!function_exists('doc_to_legacy')) {
    function doc_to_legacy($doc, $file_paths, $meta, $pages_count)
    {
        $legacy = new stdClass();
        $attributes = $meta;
        $legacy->id = 'doc-' . $doc->id;
        $legacy->doc_id = $doc->id;
        $legacy->author_id = $doc->owner_id;
        $legacy->type = 'pdf';
        $legacy->shelf_id = $doc->original_collection;
        $legacy->original_collection = $doc->original_collection;
        $legacy->file_url_pdf = $file_paths['pdf'];
        $legacy->file_url_epub = $file_paths['epub'];
        $legacy->file_url_cover = $file_paths['cover'];
        $legacy->timestamp = $doc->updated;
        $legacy->public = !empty($doc->visibility) ? $doc->visibility : '0';
        $legacy->book_name = $doc->name;
        $legacy->book_name_clean = $doc->name;
        //pages count
        $legacy->pages = "" . $pages_count;
        $legacy->ordering = 'pdf';
        $legacy->allow_aggregating = !empty($doc->allow_aggregating) ? $doc->allow_aggregating : '0';
        //object containing type attribute and url
        // designs part of url
        $legacy->attributes = $attributes;
        return $legacy;
    }
}
if (!function_exists('busy_page_to_legacy')) {
    function busy_page_to_legacy()
    {
        $busy_pages = [];
        $nxt = new stdClass();
        $nxt->nr = 0;
        $nxt->width = 992;
        $nxt->height = 1403;
        $nxt->url = 'assets/img/hourglass_page.gif';
        $nxt->type = 'busy page';
        $nxt->original = new stdClass();
        $busy_pages[] = $nxt;
        return $busy_pages;
    }
}

if (!function_exists('page_to_legacy')) {
    function page_to_legacy($pages)
    {
        $legacy_pages = [];
        if (empty($pages)) $pages = array();
        foreach ($pages as $p) {
            $p->image = "image/" . $p->file_id;
            $nxt = new stdClass();
            $nxt->nr = $p->number;
            $nxt->width = $p->width;
            $nxt->height = $p->height;
            $nxt->url = $p->image;
            $nxt->original = $p;
            $legacy_pages[] = $nxt;
        }
        return $legacy_pages;
    }
}
if (!function_exists('meta_to_legacy')) {
    function meta_to_legacy($doc_id, $metaModel)
    {
        $res = new stdClass();
//        $res->url = new stdClass();
        if (!empty($doc_id)) {
            $keys = $metaModel->findAllKeys($doc_id);
        }
        if (empty($keys)) $keys = array();

        foreach ($keys as $n => $k) {
            if ($k->name === 'Meme' || $k->name === 'Designs' || $k->name === 'Print') {
                $res->url[$k->name] = $metaModel->findAllValues($doc_id, $k->id) ?? [];
            } else {
                $res->attribute[$k->name] = $metaModel->findAllValues($doc_id, $k->id) ?? [];
            }
        }
        return $res;
    }
}
if (!function_exists('extract_file_paths')) {
    function extract_file_paths($doc)
    {
        if (empty($doc)) {
            return (object)[];
        }
        $docName = str_replace(" ", "_", $doc->name);
        $pdf = !empty($doc->pdf) ? 'pdf/' . $docName . '/' . $doc->pdf : '';
        $epub = !empty($doc->epub) ? 'epub/' . $docName . '/' . $doc->epub : '';
        $cover = 'cover/' . $doc->id;
//      $cover = 'assets/img/hourglass.gif';
        $file_paths = [
            "pdf" => $pdf,
            "epub" => $epub,
            "cover" => $cover
        ];
        return $file_paths;
    }
}
if (!function_exists('models_for_legacy_convert')) {
    function models_for_legacy_convert($_self)
    {
        $_self->load->model('TaskModel');
        $taskCnf = json_decode(file_get_contents('/var/www/html/pageshare/worker/worker.json'));
        $_self->load->model('DocPageModel');
        $_self->load->model("DocModel");
        $_self->load->model("MetaModel");
        $_self->load->model("Shelf_model");
        $models = (object)[
            'DocModel' => $_self->DocModel,
            'DocPageModel' => $_self->DocPageModel,
            'MetaModel' => $_self->MetaModel,
            'Shelf_model' => $_self->Shelf_model,
            'TaskModel' => $_self->TaskModel->init($taskCnf)
        ];
        return $models;
    }
}
