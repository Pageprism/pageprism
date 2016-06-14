<!-- Container -->
<div class="container-fluid admin-container">

<?php
  $query = $this->db->query("SELECT * FROM audio_file WHERE `book_id`= ?", array($id));
  $audio_files = $query->result();
?>
	<?php echo form_open_multipart('admin/document/update_info');?>

	<p><span class="label">Name:</span> <?php echo form_input('book_name', $book->book_name);?></p>
	<!--<p><span class="label">Like enough to get a copy URL: </span><?php echo form_input('eorder_url', $book->eorder_url);?></p>
	<p><span class="label">Share poster URL: </span><?php echo form_input('share_poster_url', $book->share_poster_url);?></p>-->
	<p><span class="label">Collection:</span>
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
			echo form_dropdown('shelf_id', $items, $book->shelf_id);
  ?></p>
  <fieldset>
    <legend>Details</legend>
    <?php $this->load->view('admin/document/attributes', array('book' => $book, 'type' => 'attribute', 'default_attributes' => ['Author', 'Category', 'Language', 'Year'], 'allow_multiple_values' => true)); ?> 
  </fieldset>
  <fieldset>
    <legend>URLs</legend>
    <?php $this->load->view('admin/document/attributes', array('book' => $book, 'type' => 'url', 'default_attributes' => ['Meme', 'Print', 'Design'], 'allow_multiple_values' => false)); ?> 
  </fieldset>
  <?php if (!empty($audio_files)): ?>
  <h2>MP3 audio files</h2>
  <table>
    <tr>
      <th>Track</th>
      <th>Appears on page number</th>
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
  <?php echo form_hidden('id', $book->id);?>

	<?php echo form_submit('update', 'Update'); ?>

	<hr>
	<a href="/admin/document/delete_document/<?php echo $book->id;?>">Remove document</a>

</form>
</div>
