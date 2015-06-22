<html>
<head>
	<base href="<?php echo base_url();?>" target="_blank">
	<title>Dokkari</title>
</head>
<style type="text/css">
body {text-align:center;}
</style>
<body>

<?php
$query = $this->db->query('SELECT * FROM pdf WHERE `book_id`="5"');

	if ($query->num_rows() > 0)
	{
		foreach ($query->result_array() as $row)
		{
		   echo '<img src="'.$row['page_image_url'].'" id="'.$row['page_n'].'" /><br />';
		}
	} else {
		echo 'no results';
	}
?>


</body>
</html>



