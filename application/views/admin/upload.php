<!-- Container -->
<div class="container-fluid admin" id="the-container">

	<?php
	if (isset($error)) echo "<h3>$error</h3>";
	?>

	<h1>Upload document:</h1>
	<p>Uploader id: <?php echo $this->session->userdata('user_id');?> (<?php echo $this->session->userdata('user_name');?>)</p>
	<?php echo form_open_multipart('admin/document/create_document');?>
	<p><span class="label">PDF File: </span><?php echo form_upload('pdffile');?></p>
  <p><span class="label">PDF Rendering Accuracy: </span><?php echo form_dropdown('pdf_resolution_dpi', array(
    //'120' => 'Fast (120)', 
    '300' => 'Normal (300)', 
    '600' => 'Double (600)', 
    '900' => 'Huge (900)', 
  ), '300');?></p>
	<p><span class="label">ePub File: </span><?php echo form_upload('epubfile');?></p>
	<p><span class="label">MP3 File or MP3 Zip File: </span><?php echo form_upload('audiozipfile');?></p>
	<p><span class="label">Meta: </span><?php echo form_textarea('meta');?></p>
	<p><span class="label">Language: </span><?php echo form_input('language');?></p>
	<p><span class="label">Item name: </span><?php echo form_input('book_name');?></p>
	<p><span class="label">Author: </span><?php echo form_input('book_author');?></p>
	<p><span class="label">Timestamp: </span><?php echo form_input('book_timestamp');?></p>
	<p><span class="label">Meme URL: </span><?php echo form_input('follow_author_url');?></p>
	<p><span class="label">Print URL: </span><?php echo form_input('memory_piece_url');?></p>
	<p><span class="label">Layouts/Licences URL: </span><?php echo form_input('misc_file_url');?></p>
	<!--<p><span class="label">Like enough to get a copy URL: </span><?php echo form_input('eorder_url');?></p>
	<p><span class="label">Share poster URL: </span><?php echo form_input('share_poster_url');?></p>-->
	<p><span class="label">Shelf: </span>
		<?php 
		$items = array();
		$query = $this->db->query('SELECT id, name FROM shelf');
			if ($query->num_rows() > 0)
			{
				foreach ($query->result_array() as $row)
				{
					$items[$row['id']] = $row['name'];
				}
			} else {
				$items = array('0' => 'No shelfs found');
				$disable_form = true;
			}
			echo form_dropdown('shelf_id', $items);
		?></p>
	<?php if(isset($disable_form) == true)
	{
		echo form_submit('upload', 'Upload file', 'disabled=disabled');
	} else {
		echo form_submit('upload', 'Upload file');
	}
	?>

</form>
</div>
