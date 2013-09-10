<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload extends MY_Controller {

    function __construct()
    {
        parent::__construct();
    }

	function index()
	{
		$this->layout->show('admin/upload');
	}

	function do_upload()
	{
		$timestamp = date("Y/m/d/");
		$path = getcwd()."/".UPLOADS.$timestamp;
		$config['upload_path'] = $path;
		$config['allowed_types'] = 'gif|jpg|png|pdf|epub';

		if (!file_exists($path)) {
		    mkdir($path, 0777, true);
		}

		$this->upload->initialize($config);

		if ( ! $this->upload->do_upload())
		{
			$error = array('error' => $this->upload->display_errors());
			print_r($error);
			//$this->load->view('upload_form', $error);
		}
		else
		{
			print_r($this->upload->post());
			$data = $this->upload->data();
			$original_file  = $data['full_path'];
			$type = substr(strrchr($original_file, '.'), 1);

			// Insert SQL data
			$author_id = $this->input->post('author_id');
			$meta = $this->input->post('meta');
			$language = $this->input->post('language');
			$shelf_id = $this->input->post('shelf_id');
			$book_author = $this->input->post('book_author');
			$book_timestamp = $this->input->post('book_timestamp');

			$sql_data = array(
				'author_id' => $author_id,
				'type' => $type,
				'file_url_pdf' => UPLOADS.$timestamp.$data['raw_name'].'.pdf',
				'file_url_epub' => '',
				'coverfile_url' => '',
				'meta' => $meta,
				'language' => $language,
				'price' => '',
				'shelf_id' => $shelf_id,
				'book_author' => $book_author,
				'book_timestamp' => $book_timestamp,
				'public' => '1');
			$this->db->insert('book', $sql_data);
			$insert_id = $this->db->insert_id();


			if ($type == 'pdf')
			{
				$time = strtotime("now");
				$save_to = $path.$data['raw_name'].'-'.$time.'.png';
				exec("/opt/ImageMagick/bin/convert $original_file $save_to", $output, $return_var);
				echo 'Converting to .png...';
				if ($return_var == 0) echo 'Done.';


				$filecount = 0;
				$files = glob($path . $data['raw_name'].'-'.$time.'-*.png');
				if ($files){
					$filecount = count($files);
				}

				for($i=1;$i<$filecount;$i++)
				{
					echo "<br>filu # $i";
					$sql_data_pdf = array(
						'book_id' => $insert_id,
						'page_image_url' => UPLOADS.$timestamp.$data['raw_name'].'-'.$time."-$i.png",
						'page_pdf_url' => 'pdf_url',
						'page_n' => $i);
					$this->db->insert('pdf', $sql_data_pdf);					
				}
				$update_data = array(
                	'pages' => $filecount
           		);
				$this->db->where('id', $insert_id);
				$this->db->update('book', $update_data); 

			}

			//$this->load->view('upload_success', $data);
		}
	}

	function do_database()
	{
		$foldername = 'zyzzfolder';
		$folder = opendir($foldername);
		$pic_types = array('jpg', 'jpeg', 'gif', 'png');

		while ($filename = readdir ($folder)) {

		  if(in_array(substr(strtolower($filename), strrpos($filename,'.') + 1),$pic_types))
			{
				if (round(filesize($foldername.$filename)/1024, 0) > 50)
				{
					echo '<p>File size over 50KB: $filename, '.round(filesize($foldername.$filename)/1024, 0).' KB<br>';
					echo '<code>/opt/ImageMagick/bin/convert -quality 85 '.$foldername.$filename.' '.$foldername.substr($filename, 0, -3).'jpg </code></p>';
				} 				
			}
		}
	}
}

/* End of file upload.php */
/* Location: ./application/controllers/admin/upload.php */