<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Book extends CI_Controller {

	public function index() {
		redirect("/");
	}

	public function view() {
		$post_data = $this->input->post();
		if ($post_data) {
			$name = $post_data['id'];
			$page_n = "1";
		} else {
			$name = $this->uri->segment(2);
			$page_n = substr($this->uri->segment(3),1);
		}

		$query = $this->db->query("SELECT * FROM book WHERE book.book_name_clean = '$name' AND type='pdf'");
		if ($query->num_rows() > 0)
		{
			foreach ($query->result_array() as $row)
			{
				$this->layout->show('index', array('rendered_content' => $this->load_pages($row['id'],$page_n,"0","0"), 'shelf_id' => $row['shelf_id'], 'page' => $page_n, 'book_id' => $row['id'], 'totalpages' => $row['pages'], 'title' => $row['book_name'], 'book_author' => $row['book_author'], 'book_timestamp' => $row['book_timestamp']));
			}
		} else {
			//echo 'no results (view) "SELECT * FROM book WHERE book.book_name_clean = "'.$name.'"';
			redirect("/");
		}
	}

	public function song() {
		$name = $this->uri->segment(2);

		$query = $this->db->query("SELECT * FROM book WHERE book_name_clean = '$name' AND type='mp3'");
		if ($query->num_rows() > 0)
		{
			foreach ($query->result_array() as $row)
			{
				$this->layout->show('index', array('rendered_content' => array("array" => $this->load_pages($row['id'],"1","1","0")), 'shelf_id' => $row['shelf_id'], 'page' => "1", 'book_id' => $row['id'], 'title' => $row['book_name'], 'format_music' => "yes", 'book_author' => $row['book_author'], 'book_timestamp' => $row['book_timestamp']));
			}
		} else {
			//echo 'no results (view) "SELECT * FROM book WHERE book.book_name_clean = "'.$name.'"';
			redirect("/");
		}
	}

	public function download_file() {
		$name = $this->uri->segment(2);

		$query = $this->db->query("SELECT * FROM book WHERE book_name_clean = '$name' AND type='epub'");
		if ($query->num_rows() > 0)
		{
			foreach ($query->result_array() as $row)
			{
				$this->layout->show('index', array('rendered_content' => array("array" => $this->load_pages($row['id'],"1","0","1")), 'shelf_id' => $row['shelf_id'], 'page' => "1", 'book_id' => $row['id'], 'title' => $row['book_name'], 'book_author' => $row['book_author'], 'book_timestamp' => $row['book_timestamp']));
			}
		} else {
			//echo 'no results (view) "SELECT * FROM book WHERE book.book_name_clean = "'.$name.'"';
			redirect("/");
		}
	}

	public function load_pages_js() {
		$post_data = $this->input->post();
		if ($post_data) {
			$id = $post_data['id'];
			$page_n = $post_data['page_n'];
			$music = $post_data['music'];
			$download = $post_data['download'];
			$printable_content = $this->load_pages($id,$page_n,$music,$download);
			if ($music == "1" || $download == "1") {
				echo $printable_content;
			} else {
				echo $printable_content[0];
			}
		}
		
	}

	public function load_pages($id, $page_n, $music, $download) {
		if ($music == "1" || $download == "1") {
			$query = $this->db->query("SELECT * FROM book WHERE id='$id'");
		} elseif ($page_n == "all") {
			$query = $this->db->query("SELECT pdf.*,book.* FROM pdf,book WHERE pdf.book_id='$id' and pdf.book_id = book.id");
		} else {
			$query = $this->db->query("SELECT pdf.*,book.* FROM pdf,book WHERE pdf.book_id='$id' and pdf.book_id = book.id and pdf.page_n='$page_n'");
		}
		
		if ($query->num_rows() > 0)
		{

			if ($music == 1 || $page_n == "all" || $download == 1) {	
				if ($music == "1") {
					$musicdata = $query->row();
					$player = '
				        <div class="row-fluid single-page" class="player">
				            <div class="span12">
				                <div class="rendered-page">
				                    <div class="page-share">
				                        <span class="pagenumber">1</span>
				                        <div class="share-part">
				                            <h5>Direct URL</h5>
				                            <p class="direct-url">'.base_url().'music/'.$musicdata->book_name_clean.'</p>
				                            <h5>Download file</h5>
				                            <a href="'.$musicdata->file_url_music.'" class="download-pdf table-view-only"><i class="icon-play-sign"></i> MP3</a>
				                            <h5>Share</h5>
				                            <a class="social share-fb" href="'.base_url().'music/'.$musicdata->book_name_clean.'" rel="'.$musicdata->book_name.'"><i class="icon-facebook-sign"></i></a>
				                            <a class="social" href="https://plus.google.com/share?url='.base_url().'music/'.$musicdata->book_name_clean.'" onclick="javascript:window.open(this.href,\'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;"><i class="icon-google-plus-sign"></i></a>
				                            <a class="social" href="https://twitter.com/share?url='.base_url().'music/'.$musicdata->book_name_clean.'" target="_blank"><i class="icon-twitter-sign"></i></a>
				                        </div>

				                    </div>
									<audio preload="auto" src="'.$musicdata->file_url_music.'" />
									<p class="single-lyrics">'.nl2br($musicdata->meta).'</p>
				                </div>
				            </div>
				        </div>';
				        return $player;
				        goto end;
				}
				if ($page_n == "all" && $download == "0") {
					echo $query->num_rows();
					goto end;
				}
				if ($download == "1") {
					$downloaddata = $query->row();
					$stuff = '
				        <div class="row-fluid single-page" class="download">
				            <div class="span12">
				                <div class="rendered-page">
				                    <div class="page-share">
				                        <span class="pagenumber">1</span>
				                        <div class="share-part">
				                            <h5>Direct URL</h5>
				                            <p class="direct-url">'.base_url().'epub/'.$downloaddata->book_name_clean.'</p>
				                            <h5>Download file</h5>
				                            <a href="'.$downloaddata->file_url_epub.'" class="download-pdf table-view-only"><i class="epub-icon"></i> ePub</a>
				                            <h5>Share</h5>
				                            <a class="social share-fb" href="'.base_url().'epub/'.$downloaddata->book_name_clean.'" rel="'.$downloaddata->book_name.'"><i class="icon-facebook-sign"></i></a>
				                            <a class="social" href="https://plus.google.com/share?url='.base_url().'epub/'.$downloaddata->book_name_clean.'" onclick="javascript:window.open(this.href,\'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;"><i class="icon-google-plus-sign"></i></a>
				                            <a class="social" href="https://twitter.com/share?url='.base_url().'epub/'.$downloaddata->book_name_clean.'" target="_blank"><i class="icon-twitter-sign"></i></a>
				                        </div>
				                    </div>
									<p class="single-epub">Click <a href="'.$downloaddata->file_url_epub.'">here</a> to download ePub</p>
				                </div>
				            </div>
				        </div>';
				        return $stuff;
				        goto end;
				} 
			} else {
				foreach ($query->result_array() as $row)
				{
					$url_pdf = ""; $url_epub = ""; $eorder_url = "";
                    if(!empty($row['file_url_pdf'])) {
                    	$url_pdf = '<a href="'.$row['file_url_pdf'].'" class="download-pdf table-view-only"><i class="icon-book"></i> PDF</a>';
                	}
                    if (!empty($row['file_url_epub'])) {
                    	$url_epub = '<a href="'.$row['file_url_epub'].'" class="download-epub table-view-only"><i class="icon-book"></i> ePub</a>';
                	}
                	if (!empty($row['eorder_url'])) {
                		$url = (strlen($row['eorder_url']) > 40) ? substr($row['eorder_url'],0,40).'...' : $row['eorder_url'];
                		$eorder_url = '<h5>eOrder</h5> <a href="'.$row['eorder_url'].'" target="_blank">'.$url.'</a>';
                	}
				    $pages[] = '
				    <!-- single page '.$row['page_n'].' -->
			        <div class="row-fluid single-page" id="page_'.$row['page_n'].'">
			            <div class="span12">
			                <div class="rendered-page">
			                    <div class="page-share">
			                        <span class="pagenumber">'.$row['page_n'].'</span>
			                        <div class="share-part">
			                        	<div share-part-separator>
				                            <h5 class="url">Direct URL to this piece</h5>
				                            <p class="direct-url">'.base_url().'book/'.$row['book_name_clean'].'/p'.$row['page_n'].'</p>
				                        </div>
			                        	<div share-part-separator>
				                            <h5>Download the book as file: </h5>
				                            '.$url_pdf.' '.$url_epub.'
				                        </div>
			                        	<div share-part-separator>
				                            <h5>Share: </h5>
				                            <a class="social share-fb" href="'.base_url().'book/'.$row['book_name_clean'].'/p'.$row['page_n'].'" rel="'.$row['book_name'].'"><i class="icon-facebook-sign"></i></a>
				                            <a class="social" href="https://plus.google.com/share?url='.base_url().'book/'.$row['book_name_clean'].'/p'.$row['page_n'].'" onclick="javascript:window.open(this.href,\'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;"><i class="icon-google-plus-sign"></i></a>
				                            <a class="social" href="https://twitter.com/share?url='.base_url().'book/'.$row['book_name_clean'].'/p'.$row['page_n'].'" target="_blank"><i class="icon-twitter-sign"></i></a>
	 										'.$eorder_url.'
			                        	</div> 
			                        </div>
			                    </div>
			                    <img class="rendered-page-single" src="'.$row['page_image_url'].'" />
			                </div>
			            </div>
			        </div>';
				}
				return $pages;				
			}
			end:
			
		} else {
			echo 'no results (load_pages)';
		}
	}

}

/* End of file welcome.php */
/* Location: ./application/controllers/book.php */