<!-- Container -->
<div class="container-fluid admin" id="the-container">
  <h1>Shelves</h1>
<?php if ($shelves): ?>
<table>
  <tr>
    <th>Name</th>
    <th>Books</th>
    <th>Created</th>
    <th>Actions</th>
    <th>Use as frontpage</th>
    <th>Display in</th>
  </tr>
  <?php foreach ($shelves as $row): ?>
  <tr>
    <td><a href="/admin/shelf/modify/<?= $row->id; ?>"><?= $row->name; ?></a></td>
    <td><?= $row->bookcount; ?></td>
    <td><?= $row->created; ?></td>
    <td>
      <a href="/shelf/<?= $row->id; ?>">View</a>
      <a href="/admin/shelf/modify/<?= $row->id; ?>">Edit</a>
    </td>
    <td>
      <?php if ($row->is_frontpage): ?>
      <a style="color: green;" href="/admin/shelf/set_frontpage_bit/<?= $row->id; ?>/0">Yes</a>
      <?php else: ?>
      <a style="color: red;" href="/admin/shelf/set_frontpage_bit/<?= $row->id; ?>/1">No</a>
      <?php endif; ?>
    </td>
    <td><?= ucfirst($row->menu_parent); ?></td>
  </tr>
  <?php endforeach; ?>
</table>
<?php echo form_open('admin/shelf/set_frontpage');?>
<fieldset>
  <legend>Set frontpage</legend>
  <select name="frontpage">
    <option value="all">Use any shelf randomly</option>
    <?php foreach ($shelves as $row): ?>
    <option value="<?= $row->id ?>"><?= htmlspecialchars($row->name) ?></option>
    <?php endforeach; ?>
  </select>
	<?php echo form_submit('update', 'Set frontpage'); ?>
</fieldset>
</form>
<?php	else: ?>
<p>No shelves found</p>
<?php endif; ?>
<?php echo form_open('admin/shelf/add_shelf');?>
<fieldset>
  <legend>Add shelf</legend>
Shelf name: <?php echo form_input('shelf_name');?>
<?php echo form_submit('submit', 'Add');?>
</fieldset>
</form>

</div>
