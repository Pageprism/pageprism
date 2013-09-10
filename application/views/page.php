<!-- Container -->
<div class="container-fluid" id="the-container">
   
        <!-- single page 2 -->
        <div class="row-fluid static-page">
            <div class="span1"></div>
            <div class="span7">

		       <?php
				if (isset($page_name)) {
					$contentquery = $this->db->query("SELECT * FROM pages WHERE `url_title`='$page_name' lIMIT 1");
					if ($contentquery->num_rows() > 0) {
						$content = $contentquery->row();
					?>
                
	                <h1><?php echo $content->title;?></h1>

					<?php echo $content->content;?>

				<?php
					} else {
						echo "<h1>Page not found</h1>";
					}
				}
		        ?>

            </div>
            <div class="span4"></div>
        </div>

	</div><!-- /rendered-pages -->