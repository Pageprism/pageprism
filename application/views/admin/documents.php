<!-- Container -->
<div class="container-fluid admin" id="the-container">

<?php
$query = $this->db->query('SELECT * FROM book');

	if ($query->num_rows() > 0)
	{
		foreach ($query->result_array() as $row)
		{
		    echo '<p><b>Book name</b>: '.$row['book_name'].' - ';
		    echo 'Author: '.$row['book_author'].' - '.$row['book_timestamp'].' [<a href="/admin/document/modify/'.$row['id'].'">modify</a>]</p>';
		}
	} else {
		echo 'No documents found';
	}
?>

</div>