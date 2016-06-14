<div class="container-fluid admin-container">
	<?php
  if (isset($error)) echo "<h3>$error</h3>";
  
  $book = $book ?? null; 
  $is_new = empty($book->id);
  
  if (!$is_new) {
    $query = $this->db->query("SELECT * FROM audio_file WHERE `book_id`= ?", array($book->id));
    $audio_files = $query->result();
  } else $audio_files = [];
	?>
<?php echo form_open_multipart('admin/document/save');?>

	<p><span class="label">Name:</span> <?php echo form_input('book_name', $book->book_name ?? null);?></p>
  <?php if (empty($prechosen_shelf)): ?>
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
				$items = array('0' => 'No collections found');
				$disable_form = true;
			}
      echo form_dropdown('shelf_id', $items, $book->shelf_id ?? null); ?>
  </p>
  <?php else: ?>
  <?php echo form_hidden('shelf_id', $prechosen_shelf->id);?>
  <?php endif; ?>
  <?php if ($is_new) $this->load->view('admin/document/files'); ?>
  <fieldset>
    <legend>Details</legend>
    <?php $this->load->view('admin/document/attributes', array(
      'book' => $book, 'type' => 'attribute', 'options' => [
        'default_attributes' => ['Author', 'Category', 'Language', 'Year of publication'], 
        'allow_multiple_values' => true
      ])); ?> 
  </fieldset>
  <fieldset>
    <legend>URLs</legend>
    <?php $this->load->view('admin/document/attributes', array(
      'book' => $book, 'type' => 'url', 'options' => [
        'default_attributes' => ['Meme', 'Print', 'Designs'], 
        'allow_editing_names' => true,
        'allow_multiple_values' => false
      ])); ?> 
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

  <?php if ($is_new): ?>
  <?= form_submit('upload', 'Upload file', isset($disable_form) ? 'disabled=disabled' : null); ?>
  <?php else: ?>
  <?= form_hidden('id', $book->id);?>
  <?= form_submit('update', 'Update', isset($disable_form) ? 'disabled=disabled' : null); ?>
	<hr>
  <a href="/admin/document/delete_document/<?php echo $book->id;?>">Remove document</a>
  <?php endif; ?>

</form>
</div>
