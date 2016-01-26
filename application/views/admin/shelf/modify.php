<!-- Container -->
<div class="container-fluid admin" id="the-container">
	<h1>Modify shelf:</h1>
	<?php echo form_open_multipart('admin/shelf/update_info');?>

	<p><span class="label">Name:</span> <?php echo form_input('name', $shelf->name);?></p>
	<p><span class="label">Menu position:</span>
		<?php 
$items = array('shelves' => 'Shelves', 'principles' => 'Principles');
    echo form_dropdown('menu_parent', $items, $shelf->menu_parent);
  ?></p>
  <?php echo form_hidden('id', $shelf->id);?>
	<?php echo form_submit('update', 'Update'); ?>

	<hr>
	<a href="/admin/shelf/remove/<?php echo $shelf->id;?>">Remove shelf</a>

</form>
</div>
