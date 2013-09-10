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
		$author_id = $this->input->post('author_id');
		$meta = $this->input->post('meta');
		$language = $this->input->post('language');
		$shelf_id = $this->input->post('shelf_id');
		$book_name = $this->input->post('book_name');
		$book_name_clean = formatURL($book_name);
		$book_author = $this->input->post('book_author');
		$book_timestamp = $this->input->post('book_timestamp');
		$eorder_url = $this->input->post('eorder_url');

		$update_data = array(
			'author_id' => $author_id,
			'book_name' => $book_name,
			'book_name_clean' => $book_name_clean,
			'book_author' => $book_author,
			'book_timestamp' => $book_timestamp,			
			'meta' => $meta,
			'language' => $language,
			'shelf_id' => $shelf_id,
			'eorder_url' => $eorder_url,
			'public' => '1'
		);

		$this->db->where('id', $id);
		$this->db->update('book', $update_data); 

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
				if(strlen($data->file_url_music) > 0) unlink($_SERVER['DOCUMENT_ROOT']."/".$data->file_url_music);
				if(strlen($data->file_url_pdf) >0) unlink($_SERVER['DOCUMENT_ROOT']."/".$data->file_url_pdf);
				if(strlen($data->file_url_epub) >0) unlink($_SERVER['DOCUMENT_ROOT']."/".$data->file_url_epub);
				if(strlen($data->file_url_cover) >0) unlink($_SERVER['DOCUMENT_ROOT']."/".$data->file_url_cover);

				if ($data->type == "pdf") {
					$pdfquery = $this->db->query("SELECT * FROM pdf WHERE `book_id`=$data->id");
					foreach ($pdfquery->result_array() as $pdfrun) {
						unlink($_SERVER['DOCUMENT_ROOT']."/".$pdfrun['page_image_url']);
						echo $pdfrun['page_image_url']. "deleted<br>";
						$this->db->delete('pdf', array('id' => $pdfrun['id']));
						echo $pdfrun['id']." id poistettu";
					}
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

	function do_upload()
	{
		$timestamp = date("Y/m/d/");
		$path = getcwd()."/".UPLOADS.$timestamp;
		$config['upload_path'] = $path;
		$config['allowed_types'] = 'gif|jpg|png|pdf|mp3|epub';
		$config['xss_clean'] = FALSE;

		// Create dir /yyyy/mm/dd
		if (!file_exists($path)) {
		    mkdir($path, 0777, true);
		}



		// Insert SQL data from form
		$author_id = $this->input->post('author_id');
		$meta = $this->input->post('meta');
		$language = $this->input->post('language');
		$shelf_id = $this->input->post('shelf_id');
		$book_name = $this->input->post('book_name');
		$book_name_clean = formatURL($book_name);
		$book_author = $this->input->post('book_author');
		$book_timestamp = $this->input->post('book_timestamp');
		$eorder_url = $this->input->post('eorder_url');


		$sql_data = array(
			'author_id' => $author_id,
			'type' => '',
			'book_name' => $book_name,
			'book_name_clean' => $book_name_clean,
			'book_author' => $book_author,
			'book_timestamp' => $book_timestamp,			
			'meta' => $meta,
			'language' => $language,
			'price' => '',
			'shelf_id' => $shelf_id,
			'eorder_url' => $eorder_url,
			'public' => '1');
		$this->db->insert('book', $sql_data);
		$insert_id = $this->db->insert_id();


		// For each uploaded file
        foreach ($_FILES as $key => $value)
        {
        	// If filename exists
            if (!empty ($value['name']))
            {
            	// Load upload.cfg
                $this->upload->initialize($config);
                // Something wrong? Yes...
				if ( ! $this->upload->do_upload())
				{
					$error = array('error' => $this->upload->display_errors());
					//print_r($error);
					$this->layout->show('admin/upload', $error);
				}
				// No, let´s go!
                else
                {

				//$data = $this->upload->data();
				$get_fileinfo = pathinfo($value['name']);
				$original_filename  = $get_fileinfo['basename'];
				//$type = $get_fileinfo['extension'];
				$rawname = $get_fileinfo['filename'];
				$type = substr(strrchr($value['name'], '.'), 1);

				// Unique timestamp for filename
				$time = strtotime("now");


				if ($type == 'pdf')
				{
					$original_file = $path.$original_filename;
					$save_to = $path.$rawname.'-'.$time.'.png';
					//exec("/usr/bin/convert -density 120 $original_file $save_to", $output, $return_var);
					exec("/opt/ImageMagick/bin/convert -density 120 $original_file $save_to", $output, $return_var);
					echo 'Converting to .png...';
					if ($return_var == 0) echo 'Done.';

					$filecount = 0;
					$files = glob($path . $rawname.'-'.$time.'-*.png');
					if ($files)
					{
						$filecount = count($files);
					}

					// Fix filename for single page documents
					if ($filecount == "1") {
						$oldname = $path.$rawname.'-'.$time.'.png';
						$newname = $path.$rawname.'-'.$time.'-0.png';
						rename($oldname, $newname);
					}


					for($i=0;$i<$filecount;$i++)
					{
						$sql_data_pdf = array(
							'book_id' => $insert_id,
							'page_image_url' => UPLOADS.$timestamp.$rawname."-$time-$i.png",
							'page_pdf_url' => 'pdf_url',
							'page_n' => $i+1);
						$this->db->insert('pdf', $sql_data_pdf);					
					}




					// PDF specific values
					$file_url_pdf = UPLOADS.$timestamp.$rawname.'.pdf';
					$file_url_cover = UPLOADS.$timestamp.$rawname.'-'.$time.'-0_thumb.png';

					$update_data = array(
	                	'pages' => $filecount,
						'file_url_pdf' => $file_url_pdf,
						'file_url_cover' => $file_url_cover
	           		);
					$this->db->where('id', $insert_id);
					$this->db->update('book', $update_data); 

					echo '<br />Creating thumbnail...';
					$thumb_config['image_library'] = 'gd2';
					$thumb_config['source_image'] = UPLOADS.$timestamp.$rawname.'-'.$time.'-0.png';
					$thumb_config['create_thumb'] = TRUE;
					$thumb_config['maintain_ratio'] = TRUE;
					$thumb_config['width'] = 75;
					$thumb_config['height'] = 110;
					$this->load->library('image_lib', $thumb_config); 
					$this->image_lib->resize();
					echo 'Done';

				}

				if ($type == "mp3") {
					// mp3 specific values
					$file_url_music = UPLOADS.$timestamp.$rawname.'.mp3';

					$update_data = array(
						'file_url_music' => $file_url_music
	           		);
					$this->db->where('id', $insert_id);
					$this->db->update('book', $update_data); 
					echo "Music file uploaded";
				}

				if ($type == "epub") {
					$file_url_epub = UPLOADS.$timestamp.$rawname.'.epub';

					$update_data = array(
						'file_url_epub' => $file_url_epub
	           		);
					$this->db->where('id', $insert_id);
					$this->db->update('book', $update_data); 
					echo "ePub file uploaded";
				}

				

	        	}
        	}
        }
       	$this->layout->show('admin/upload_ready');

	}

	function do_database()
	{
		$foldername = '/Library/Server/Web/Data/Sites/kirjahylly.evermade.fi/application/uploads/';
		$folder = opendir($foldername);
		$pic_types = array('jpg', 'jpeg', 'gif', 'png');

		while ($filename = readdir ($folder)) {

		  if(in_array(substr(strtolower($filename), strrpos($filename,'.') + 1),$pic_types))
			{

			$sql_data = array(
				'lupaus_id' => $lupaus_arvo,
				'lupaus_txt' => $lupaus_txt,
				'jokeri' => $jokeri,
				'ip' => $ip,
				'facebook_id' => $comment_id,
				'status' => $status);
			$this->db->insert('responses', $sql_data);


				if (round(filesize($foldername.$filename)/1024, 0) > 50)
				{
					echo '<p>File size over 50KB: $filename, '.round(filesize($foldername.$filename)/1024, 0).' KB<br>';
					echo '<code>/opt/ImageMagick/bin/convert -quality 85 '.$foldername.$filename.' '.$foldername.substr($filename, 0, -3).'jpg </code></p>';
				} 				
			}
		}
	}

	function create_new_user() 
	{
		$this->simpleloginsecure->create('user@mail', 'password', 'real name');
		echo 'created';
	}
}

/* End of file upload.php */
/* Location: ./application/controllers/admin/upload.php */