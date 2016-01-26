<!-- Container -->
<div class="container-fluid admin" id="the-container">
  <h1>Shelves</h1>
<?php

	if ($shelves)
  {
?>
<table>
  <tr>
    <th>Name</th>
    <th>Books</th>
    <th>Created</th>
    <th>Actions</th>
  </tr>
  <?php foreach ($shelves as $row): ?>
  <tr>
    <td><a href="/admin/shelf/modify/<?= $row['id']; ?>"><?= $row['name']; ?></a></td>
    <td><?= $row['bookcount']; ?></td>
    <td><?= $row['timestamp']; ?></td>
    <td>
      <a href="/shelf/<?= $row['id']; ?>">View</a>
      <a href="/admin/shelf/modify/<?= $row['id']; ?>">Edit</a>
    </td>
  </tr>
  <?php endforeach; ?>
</table>
<?php	} else {
		echo 'No shelves found';
	}
?>
<?php echo form_open('admin/shelf/add_shelf');?>
<fieldset>
  <legend>Add shelf</legend>
Shelf name: <?php echo form_input('shelf_name');?>
<?php echo form_submit('submit', 'Add');?>
</fieldset>
</form>

</div>
