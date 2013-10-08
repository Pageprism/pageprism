<!-- Container -->
<div class="container-fluid admin" id="the-container">


<h2>Content</h2>

<?php

	$query = $this->db->query('SELECT * FROM pages');

	if ($query->num_rows() > 0)
	{
		foreach ($query->result_array() as $row)
		{
		   echo '<a href="/admin/content/edit/'.$row['id'].'">'.$row['title'].'</a>&nbsp;&nbsp;&nbsp;';
		}
	}
	echo "<hr>";
	echo "<p><b>".$this->session->flashdata("message")."</b></p>";

	if (isset($id)) {
		$contentquery = $this->db->query("SELECT * FROM pages WHERE `id`='$id' lIMIT 1");
		if ($contentquery->num_rows() > 0) {
			$content = $contentquery->row();
		}
	?>
	
	<?php echo form_open_multipart('admin/content/save_content');?>
	<?php echo form_hidden(array("id" => $content->id));?>
	<h3>Title</h3>
	<?php echo form_input(array("name" => "title", "value" => $content->title));?>
	<h3>Content</h3>
	<?php echo form_textarea(array("name" => "content", "rows" => "5", "cols" => "20", "value" => $content->content));?>
	<p><?php echo form_submit('save', 'Save');?></p>

	<?php } ?>


</div>