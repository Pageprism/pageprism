<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Document extends MY_Controller {

  function __construct()
  {
    parent::__construct();
  }

  function index()
  {

  }

  function upload()
  {
    $this->layout->show('admin/upload');
  }

  function modify() {
    $id = $this->uri->segment(4);
    $this->layout->show('admin/modify',array('id' => $id));
  }

  function documentlist() {
    $this->layout->show('admin/documents');
  }

  function update_info() {
    $id = $this->input->post('id');
    $update_data = $this->getFormData();

    $this->db->where('id', $id);
    $this->db->update('book', $update_data);

    $query = $this->db->query("SELECT id FROM audio_file WHERE `book_id`= ?", array($id));
    foreach($query->result() as $audio_file) {
      $val = $this->input->post('audio_file_pages_'.$audio_file->id);
      if (strpos($val, '-') !== false) {
        list($start, $end) = explode('-', $val);
      } else {
        $start = $end = (int)$val;
      }

      $this->db->where('id', $audio_file->id);
      $this->db->update('audio_file', array(
        'page_number_start' => $start, 
        'page_number_end' => $end, 
      ));
    }

    redirect("admin/document/documentlist");
  }

  function delete_document() {
    $id = $this->uri->segment(4);
    if (is_numeric($id) == true)
    {
      $query = $this->db->query("SELECT * FROM book WHERE `id`=$id");
      if ($query->num_rows() > 0)
      {
        $data = $query->row();
        if(strlen($data->file_url_pdf) >0) unlink($_SERVER['DOCUMENT_ROOT']."/".$data->file_url_pdf);
        if(strlen($data->file_url_epub) >0) unlink($_SERVER['DOCUMENT_ROOT']."/".$data->file_url_epub);
        if(strlen($data->file_url_cover) >0) unlink($_SERVER['DOCUMENT_ROOT']."/".$data->file_url_cover);

        $pdfquery = $this->db->query("SELECT * FROM pdf WHERE `book_id`=$data->id");
        foreach ($pdfquery->result_array() as $pdfrun) {
          unlink($_SERVER['DOCUMENT_ROOT']."/".$pdfrun['page_image_url']);
          $this->db->delete('pdf', array('id' => $pdfrun['id']));
        }

        $audioquery = $this->db->query("SELECT * FROM audio_file WHERE `book_id`=$data->id");
        foreach ($audioquery->result_array() as $audiofile) {
          unlink($_SERVER['DOCUMENT_ROOT']."/".$audiofile['audio_file_url']);
          $this->db->delete('audio_file', array('id' => $audiofile['id']));
        }

        if ($this->db->delete('book', array('id' => $id)) == true)
          redirect('admin/document/documentlist');
      } else {
        echo 'ID Error: '.$this->uri->segment(4);
      }

    }
  }

  function view()
  {
    $this->load->view('admin/document');
  }

  function create_document()
  {
    //Upload files!
    $url_path = UPLOADS.date("Y/m/d/");
    $path = getcwd()."/".$url_path;
    $uploadData = $this->upload_files($path);
    
    //If there were errors show them and exit...
    if ($uploadData['errors']) {
      $error = array('error' => implode('<br>', $uploadData['errors']));
      $this->layout->show('admin/upload', $error);
      return;
    }
    
    //If no errors, save and generate book data
    $book_data = $this->getFormData();
    $audioRecords = $pageRecords = array();

    foreach($uploadData['files'] as $data) {
      //TODO: actually check type!
      $type = strtolower(substr(strrchr($data['file_name'], '.'), 1));
      //var_dump($data);

      switch($type) {
      case 'pdf':
        if (!empty($pageRecords)) continue;
        $pageRecords = $this->uploadPdf($data, $url_path, $book_data);
        break;
      case 'zip':
        if (!empty($audioRecords)) continue;
        $audioRecords = $this->uploadAudioArchive($data, $url_path);
        break;
      case 'mp3':
        if (!empty($audioRecords)) continue;
        $audioRecords[] = $this->uploadAudio($data, $url_path);
        break;
      case 'epub':
        $this->uploadEpub($data, $url_path, $book_data);
        break;
      default:
        @unlink($path.$original_filename);
      }
    }
    $this->db->insert('book', $book_data);
    $insert_id = $this->db->insert_id();
    
    foreach($pageRecords as $pageData) {
      $pageData['book_id'] = $insert_id;
      $this->db->insert('pdf', $pageData);
    }
    foreach($audioRecords as $audioData) {
      $audioData['book_id'] = $insert_id;
      $this->db->insert('audio_file', $audioData);
    }

    $this->layout->show('admin/upload_ready');
  }

  private function getFormData() {
    $author_id = $this->session->userdata('user_id');
    $meta = $this->input->post('meta');
    $language = $this->input->post('language');
    $shelf_id = $this->input->post('shelf_id');
    $book_name = $this->input->post('book_name');
    $book_name_clean = formatURL($book_name);
    $book_author = $this->input->post('book_author');
    $book_timestamp = $this->input->post('book_timestamp');
    $eorder_url = $this->input->post('eorder_url');
    $follow_author_url = $this->input->post('follow_author_url');
    $memory_piece_url = $this->input->post('memory_piece_url');
    $misc_file_url = $this->input->post('misc_file_url');

    return array(
      'author_id' => $author_id,
      'type' => 'pdf',
      'book_name' => $book_name,
      'book_name_clean' => $book_name_clean,
      'book_author' => $book_author,
      'book_timestamp' => $book_timestamp,			
      'meta' => $meta,
      'language' => $language,
      'price' => '',
      'shelf_id' => $shelf_id,
      'eorder_url' => $eorder_url,
      'follow_author_url' => $follow_author_url,
      'memory_piece_url' => $memory_piece_url,
      'misc_file_url' => $misc_file_url,
      'public' => '1'
    );
  }
  private function upload_files($path) {
    $config['upload_path'] = $path;
    $config['allowed_types'] = 'gif|jpg|png|pdf|mp3|epub|zip';
    $config['xss_clean'] = FALSE;
    $config['remove_spaces'] = TRUE;

    // Create dir /yyyy/mm/dd
    if (!file_exists($path)) {
      mkdir($path, 0777, true);
    }
    // Load upload.cfg
    $this->upload->initialize($config);
    $errors = array();
    $files = array();

    // For each uploaded file
    foreach ($_FILES as $key => $value)
    {
      // If filename exists
      if (empty ($value['name'])) {
        continue;
      }
      if ($this->upload->do_upload($key))
      {
        $files[] = $this->upload->data();
      } else {
        // Something wrong? Yes...
        $errors[] = $this->upload->display_errors();
      }
    }
    if ($errors) {
      foreach($files as $data) {
        $original_filename = $data['file_name'];
        $original_file = $path.$original_filename;
        @unlink($original_file);
      }
    }

    return array('errors' => $errors, 'files' => $files);
  }

  private function uploadPdf($data, $url_path, &$book_data) {
    $path = $data['file_path'];
    $original_filename = $data['file_name'];
    $rawname = $data['raw_name'];
    // Unique timestamp for filename
    $time = strtotime("now");

    $original_file = $data['full_path'];
    $save_to = $path.$rawname.'-'.$time.'.png';
  
    $output = $return_var = false;
    exec("convert -density 120 '$original_file' '$save_to'", $output, $return_var);

    echo 'Converting to .png...';
    if ($return_var == 0) echo 'Done.';

    $filecount = 0;
    $files = glob($path . $rawname.'-'.$time.'-*.png');
    if ($files)
    {
      $filecount = count($files);
    }

    // Fix filename for single page documents
    if (count(glob($path . $rawname.'-'.$time.'.png')) == "1") {
      $oldname = $path.$rawname.'-'.$time.'.png';
      $newname = $path.$rawname.'-'.$time.'-0.png';
      rename($oldname, $newname);
      $filecount = 1;
    }
    
    $fileRecords  = array();
    for($i=0;$i<$filecount;$i++)
    {
      $fileRecords[] = array(
        'page_image_url' => $url_path.$rawname."-$time-$i.png",
        'page_n' => $i+1
      );
    }

    echo '<br />Creating thumbnail...';
    $thumb_config['image_library'] = 'gd2';
    $thumb_config['source_image'] = $url_path.$rawname.'-'.$time.'-0.png';
    $thumb_config['create_thumb'] = TRUE;
    $thumb_config['maintain_ratio'] = TRUE;
    $thumb_config['width'] = 200;
    $thumb_config['height'] = 293;
    $this->load->library('image_lib', $thumb_config); 
    $this->image_lib->resize();

    // PDF specific values
    $file_url_pdf = $url_path.$rawname.'.pdf';
    $file_url_cover = $url_path.$rawname.'-'.$time.'-0_thumb.jpg';
    
    //Convert cover image to JPG for lower file size
    $file_url_cover_src = $url_path.$rawname.'-'.$time.'-0_thumb.png';
    exec("convert '$file_url_cover_src' '$file_url_cover'");
    unlink($file_url_cover_src);
    echo 'Done';

    $book_data['pages'] = $filecount;
    $book_data['file_url_pdf'] = $file_url_pdf;
    $book_data['file_url_cover'] = $file_url_cover;

    return $fileRecords;
  }

  private function uploadEpub($data, $url_path, &$book_data) {
    $file_url_epub = $url_path.$data['raw_name'].'.epub';

    $book_data['file_url_epub'] = $file_url_epub;
    echo "ePub file uploaded";
  }
  private function uploadAudioArchive($data, $url_path) {
    $zip_path = $data['full_path'];
    $dest_path = $data['file_path'];

    $audio_extensions = array('mp3');

    $zip = new ZipArchive;
    $audioData = array();
    if ($zip->open($zip_path) === true) {
      for($i = 0; $i < $zip->numFiles; $i++) {
        $zipfilename = $zip->getNameIndex($i);
        $fileinfo = pathinfo($zipfilename);

        if (!isset($fileinfo['extension'])) {
          continue;
        }
        if (!in_array(strtolower($fileinfo['extension']), $audio_extensions)) {
          continue;
        }
        
        $filename = $fileinfo['filename'];
        $dest_file = $dest_path.$filename.'.'.$fileinfo['extension'];
        $nr = 1;
        while(file_exists($dest_file)) {
          $nr++;
          $filename = $fileinfo['filename'].'_'.$nr;
          $dest_file = $dest_path.$filename.'.'.$fileinfo['extension'];
        }
        
        copy("zip://".$zip_path."#".$zipfilename, $dest_file);
        $audioData[] = $this->uploadAudio(array(
          'raw_name' => $filename,
          'full_path' => $dest_file,
        ), $url_path);
      }                   
      $zip->close();                   
    }
    unlink($zip_path);

    return $audioData;
  }
  private function uploadAudio($data, $url_path) {
    require_once APPPATH.'libraries/getID3/getid3/getid3.php';

    $file_url = $url_path.$data['raw_name'].'.mp3';

    $audioData = array(
      'audio_file_url' => $file_url,
      'track_number' => 0,
      'title' => $data['raw_name'],
      'album' => '',
      'length' => 0,
      'page_number_start' => 1,
      'page_number_end' => 1,
    );
    
    try {
      $getID3 = new getID3;
      $fileInfo = $getID3->analyze($data['full_path']);
      getid3_lib::CopyTagsToComments($fileInfo);

      if (isset($fileInfo['playtime_seconds'])) {
        $audioData['length'] = round($fileInfo['playtime_seconds']);
      }
      if (!empty($fileInfo['comments_html']['title'])) {
        $audioData['title'] = implode(', ',$fileInfo['comments_html']['title']);
      }
      if (!empty($fileInfo['comments_html']['album'])) {
        $audioData['album'] = implode(', ',$fileInfo['comments_html']['album']);
      }
      if (isset($fileInfo['comments_html']['track'][0])) {
        $audioData['track_number'] = (int)$fileInfo['comments_html']['track'][0];
      }
      //implode(', ', $fileInfo['comments_html']['artist']);
    } catch(Exception $e) {
      echo 'Some error happened...';
    }

    echo "Music file uploaded";
    return $audioData;
  }

}

/* End of file upload.php */
/* Location: ./application/controllers/admin/upload.php */
