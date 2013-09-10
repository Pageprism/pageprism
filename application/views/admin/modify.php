<!-- Container -->
<div class="container-fluid admin" id="the-container">

<?php
$query = $this->db->query("SELECT * FROM book WHERE `id`=$id");

	if ($query->num_rows() > 0)
	{
		$data = $query->row();
	}
?>
	<h1>Modify file:</h1>
	<?php echo form_open_multipart('admin/document/update_info');?>

	<p><span class="label">File:</span> <?php echo $data->book_name;?></p>
	<p><span class="label">Meta:</span> <?php echo form_textarea('meta', $data->meta);?></p>
	<p><span class="label">Language:</span> <?php echo form_input('language', $data->language);?></p>
	<p><span class="label">Item name:</span> <?php echo form_input('book_name', $data->book_name);?></p>
	<p><span class="label">Author:</span> <?php echo form_input('book_author', $data->book_author);?></p>
	<p><span class="label">Timestamp:</span> <?php echo form_input('book_timestamp', $data->book_timestamp);?></p>
	<p><span class="label">eOrder URL: </span><?php echo form_input('eorder_url', $data->eorder_url);?></p>
	<p><span class="label">Shelf:</span>
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
				$items = array('0' => 'No shelves found');
				$disable_form = true;
			}
			echo form_dropdown('shelf_id', $items, $data->shelf_id);
		?></p>
	<?php echo form_hidden('author_id', $data->author_id);?>
	<?php echo form_hidden('id', $id);?>

	<?php echo form_submit('update', 'Update'); ?>

	<hr>
	<a href="/admin/document/delete_document/<?php echo $data->id;?>">Remove document</a>

</form>
</div>