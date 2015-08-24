<!-- Container -->
<div class="container-fluid" id="the-container">

    <!-- Shelfs and covers -->
    <div class="row-fluid shelfs-and-covers">

        <!-- Shelfs -->
        <div class="span3" id="shelfs">
            <ul class="">
                <?php
                $query = $this->db->query("SELECT id,name FROM shelf");
                if (isset($shelf_id)) { $firstrun = false; } else { $firstrun = true; $first_shelf = $query->row(); $shelf_id = $first_shelf->id; }
                    if ($query->num_rows() > 0)
                    {
                        foreach ($query->result_array() as $shelf)
                        {?>
                            <li<?php if (isset($shelf_id) && $shelf_id == $shelf['id'] || ($firstrun)) { echo ' class="active"'; } else {}?>><a href="/shelf/<?=$shelf['id']?>"><?=$shelf['name']?></a></li>
                        <?php
                        $firstrun = false;
                        }

                    }
                ?>
            </ul>
        </div>

        <!-- Show Covers / Show Table -->
        <div class="span9 list-cover" id="covers"> 
            <?php
            //if (isset($shelf_id)) {  } else { $shelf_id = "9";}
            $query = $this->db->query("SELECT * FROM book WHERE `shelf_id`='$shelf_id'");
                if ($query->num_rows() > 0)
                {
                    foreach ($query->result_array() as $book)
                    {?>
                    <div onClick="_gaq.push(['_trackEvent', 'Covers', 'Click-to-open', '<?=$book['book_name']?>']);" class="single-cover thumbnail<?php if (isset($book_id) && $book_id == $book['id']) echo ' selected'; ?>" id="<?=$book['id']?>" title="<?=$book['book_name']?>">

                            <!-- The "Cover" -->
                            <?php if ($book['type'] == "" || ($book['type'] == "pdf")) {?>
                            <img src="<?=$book['file_url_cover']?>" alt="" />
                            <?php } if ($book['type'] == "mp3") {?>
                            <div class="music-icon">Music</div>
                            <?php } if ($book['type'] == "epub") {?>
                            <div class="epub-icon">ePub</div>
                            <?php } ?>
                            <div class="caption">
<!--
                                <h3 class="title"><?=$book['book_name']?></h3>
                                <span class="author"><?=$book['book_author']?></span>
                                <span class="timestamp"><?=$book['book_timestamp']?></span>
                                <span class="share-counter">Shared <?php echo ($book['counter'] == 1) ? " once" : $book['counter']." times";?></span>

-->
                            </div>
                       </div>
                    <?php
                    }
                }
            ?>
        </div>  
    </div>
    <hr class="book-content-separator" style="display:none" />
    <input type="hidden" id="book-id-hidden" value="<?php if (isset($id)) echo $id?>" />

  
    <!-- The page(s) of single publication -->
    <div id="rendered-pages">

    <?php if(isset($rendered_content)) foreach($rendered_content as $rendered_single) echo $rendered_single;?>

    </div><!-- /rendered-pages -->
</div>
