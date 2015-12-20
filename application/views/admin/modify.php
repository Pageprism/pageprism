<!-- Container -->
<div class="container-fluid admin" id="the-container">

<?php
$query = $this->db->query("SELECT * FROM book WHERE `id`= ?", array($id));

	if ($query->num_rows() > 0)
	{
		$data = $query->row();
  }

  $query = $this->db->query("SELECT * FROM audio_file WHERE `book_id`= ?", array($id));
  $audio_files = $query->result();
?>
	<h1>Modify file:</h1>
	<?php echo form_open_multipart('admin/document/update_info');?>

	<p><span class="label">File:</span> <?php echo $data->book_name;?></p>
	<p><span class="label">Meta:</span> <?php echo form_textarea('meta', $data->meta);?></p>
	<p><span class="label">Language:</span> <?php echo form_input('language', $data->language);?></p>
	<p><span class="label">Item name:</span> <?php echo form_input('book_name', $data->book_name);?></p>
	<p><span class="label">Author:</span> <?php echo form_input('book_author', $data->book_author);?></p>
	<p><span class="label">Timestamp:</span> <?php echo form_input('book_timestamp', $data->book_timestamp);?></p>
	<p><span class="label">Meme URL: </span><?php echo form_input('follow_author_url', $data->follow_author_url);?></p>
	<p><span class="label">Print URL: </span><?php echo form_input('memory_piece_url', $data->memory_piece_url);?></p>
  <p><span class="label">Layouts/Licences URL: </span><?php echo form_input('misc_file_url', $data->misc_file_url);?></p>
	<!--<p><span class="label">Like enough to get a copy URL: </span><?php echo form_input('eorder_url', $data->eorder_url);?></p>
	<p><span class="label">Share poster URL: </span><?php echo form_input('share_poster_url', $data->share_poster_url);?></p>-->
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
  <?php if (!empty($audio_files)): ?>
  <h2>MP3 audio files</h2>
  <table>
    <tr>
      <th>Track</th>
      <th>Appears on page number(s)</th>
    </tr>
    <?php foreach ($audio_files as $file): ?>
    <?php
      $title = $file->title;
      if ($file->track_number) $title = "$file->track_number. $title";
      
      $page =  $file->page_number_start;
      if ($file->page_number_end > $page) {
        $page = "$page-$file->page_number_end";
      }

    ?>
    <tr>
      <td><?= $title ?></td>
      <td>
        <?php echo form_input('audio_file_pages_'.$file->id, $page);?>
      </td>
    </tr>
    <?php endforeach; ?>
  </table>
  <?php endif; ?>
	<?php echo form_hidden('id', $id);?>

	<?php echo form_submit('update', 'Update'); ?>

	<hr>
	<a href="/admin/document/delete_document/<?php echo $data->id;?>">Remove document</a>

</form>
</div>
