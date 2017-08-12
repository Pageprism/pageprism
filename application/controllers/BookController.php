<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class BookController
 * This one is from legacy code but still in use. Remove
 * only after fixing dependencies to here.
 */
class BookController extends CI_Controller
{

    public function index()
    {
        redirect("/");
    }

    public function view()
    {
        $post_data = $this->input->post();
        if ($post_data) {
            $name = $post_data['id'];
            $page_n = "1";
        } else {
            $name = $this->uri->rsegment(3);
            $page_n = substr($this->uri->rsegment(4), 1);
        }

        $this->load->model('book');
        $book = $this->book->loadBookByName($name);
        if ($book) {
            $data = (object)[
                'shelf_editable' => $this->session->userdata('logged_in'),
                'shelf_id' => $book->shelf_id,
                'shelf' => $this->book->loadShelf($book->shelf_id),
                'current_book' => $book,
                'current_page' => $page_n,
                'cover_image' => $book->file_url_cover
            ];
        } else {
            $data = (object)[
                'name' => $name,
                'status' => 'Not found!',
              'error' => 'The requested book not found!'
            ];
        }
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($data, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
    }

    public function book_info()
    {
        $id = $this->input->post_get('id');
        if ($id) {
            $this->load->model('book');
            $this->load->model('shelf_model');
            $book = $this->book->loadBook($id);
            $pages = $this->book->loadPages($id);
            $shelf = $this->shelf_model->getShelf($book->shelf_id);
            $logged_in = $this->session->userdata('user_name') != "";
            $data = [
                'book' => $book,
                'collections' => [$shelf],
                'editable' => $logged_in,
                'pages' => $pages
            ];
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($data, $this->input->is_ajax_request() ? 0 : JSON_PRETTY_PRINT));
        }
    }

}

/* End of file book.php */
/* Location: ./application/controllers/book.php */
