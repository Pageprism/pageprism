<!-- Container -->
<div class="container-fluid admin" id="the-container">

<?php echo form_open('admin/shelf/add_shelf');?>
Shelf name: <?php echo form_input('shelf_name');?>
<?php echo form_submit('submit', 'Add shelf');?>
<hr />
<?php
$query = $this->db->query('SELECT id, name, timestamp FROM shelf');

	if ($query->num_rows() > 0)
	{
		foreach ($query->result_array() as $row)
		{
		    echo '<p>id: '.$row['id'].' - ';
		    echo 'name: '.$row['name'].' - '.$row['timestamp'].' [<a href="/index.php/admin/shelf/remove_shelf/'.$row['id'].'">delete</a>]</p>';
		}
	} else {
		echo 'No shelfs found';
	}
?>

</div>