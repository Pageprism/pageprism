<!-- Container -->
<div class="container-fluid admin" id="the-container">

	<?php
	if (isset($error)) echo "<h3>$error</h3>";
	?>

	<h1>Upload file:</h1>
	<p>Uploader id: <?php echo $this->session->userdata('user_id');?> (<?php echo $this->session->userdata('user_name');?>)</p>
	<?php echo form_open_multipart('admin/document/do_upload');?>
	<p><span class="label">PDF File: </span><?php echo form_upload('userfile');?></p>
	<p><span class="label">ePub File: </span><?php echo form_upload('userfile2');?></p>
	<p><span class="label">Meta: </span><?php echo form_textarea('meta');?></p>
	<p><span class="label">Language: </span><?php echo form_input('language');?></p>
	<p><span class="label">Item name: </span><?php echo form_input('book_name');?></p>
	<p><span class="label">Author: </span><?php echo form_input('book_author');?></p>
	<p><span class="label">Timestamp: </span><?php echo form_input('book_timestamp');?></p>
	<p><span class="label">Follow author URL: </span><?php echo form_input('follow_author_url');?></p>
	<p><span class="label">Memory piece URL: </span><?php echo form_input('memory_piece_url');?></p>
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
	<?php echo form_hidden('author_id', $this->session->userdata('user_id'));?>

	<?php if(isset($disable_form) == true)
	{
		echo form_submit('upload', 'Upload file', 'disabled=disabled');
	} else {
		echo form_submit('upload', 'Upload file');
	}
	?>

</form>
</div>