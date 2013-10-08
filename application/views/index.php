<!-- Container -->
<div class="container-fluid" id="the-container">

    <!-- Covers -->
    <div class="row-fluid shelfs-and-covers">
        <div class="span12 " id="covers-controls">
            View: <a class="control-covers active" href="#">Covers</a> <a class="control-table" href="#">Downloads</a>
        </div>
    </div>

    <!-- Shelfs and covers -->
    <div class="row-fluid shelfs-and-covers">

        <!-- Shelfs -->
        <div class="span3" id="shelfs">
            <h2 class="">The Shelves</h2>
            <ul class="">
                <?php
                $query = $this->db->query("SELECT id,name FROM shelf");
                if (isset($shelf_id)) { $firstrun = false; } else { $firstrun = true; $first_shelf = $query->row(); $shelf_id = $first_shelf->id; }
                    if ($query->num_rows() > 0)
                    {
                        foreach ($query->result_array() as $shelf)
                        {?>
                            <li<? if (isset($shelf_id) && $shelf_id == $shelf['id'] || ($firstrun)) { echo ' class="active"'; } else {}?>><a href="/shelf/<?=$shelf['id']?>"><?=$shelf['name']?></a></li>
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
                        <div onClick="_gaq.push(['_trackEvent', 'Covers', 'Click-to-open', '<?=$book['book_name']?>']);" class="single-cover thumbnail" id="<?=$book['id']?>" title="<?=$book['book_name']?>">

                            <!-- The "Cover" -->
                            <?php if ($book['type'] == "" || ($book['type'] == "pdf")) {?>
                            <img src="<?=$book['file_url_cover']?>" alt="" />
                            <?php } if ($book['type'] == "mp3") {?>
                            <div class="music-icon">Music</div>
                            <?php } if ($book['type'] == "epub") {?>
                            <div class="epub-icon">ePub</div>
                            <?php } ?>
                            <div class="caption">
                                <h3 class="title"><?=$book['book_name']?></h3>
                                <span class="author"><?=$book['book_author']?></span>
                                <span class="timestamp"><?=$book['book_timestamp']?></span>
                                <span class="share-counter">Shared <? echo ($book['counter'] == 1) ? " once" : $book['counter']." times";?></span>

                                <!-- Additional "Downloads" -stuff  -->
                                <?php 
                                if(!empty($book['file_url_pdf'])) {?>
                                <a href="<?=$book['file_url_pdf']?>" class="download-pdf table-view-only" onClick="_gaq.push(['_trackEvent', 'eSamiszat-Shelf', '<?=$book['book_name'];?>', 'download pdf']);"><i class="icon-book"></i> PDF</a>
                                <?php }
                                if (!empty($book['file_url_epub'])) {?>
                                <a href="<?=$book['file_url_epub']?>" class="download-epub table-view-only" onClick="_gaq.push(['_trackEvent', 'eSamiszat-Shelf', '<?=$book['book_name'];?>', 'download epub']);"><i class="icon-epub"></i> ePub</a>
                                <?php }
                                if (!empty($book['file_url_music'])) {?>
                                <a href="<?=$book['file_url_music']?>" class="download-music table-view-only" onClick="_gaq.push(['_trackEvent', 'eSamiszat-Shelf', '<?=$book['book_name'];?>', 'download mp3']);"><i class="icon-play-sign"></i> MP3</a>
                                <?php }?>
                            </div>
                       </div>
                    <?php
                    }
                }
            ?>
        </div>  
    </div>

    <!-- The hint text -->
    <div class="row-fluid hint" style="display:none">
        <div class="span12">To share a single page or download the book, press the page number at the right top corner of the page.</div>
    </div>


    <!-- The header for single publication -->
    <div class="row-fluid publication-header">
        <div class="span12">
            <div id="scroll-to-top" style="display:none"><button class="btn">Back to shelves</button></div>
            <h1 class="title"><? if (isset($title)) echo $title?></h1>
            <span class="author"><? if (isset($book_author)) echo $book_author?></span>
            <span class="timestamp"><? if (isset($book_timestamp)) echo $book_timestamp?></span>
            <span class="book-id-hidden"><? if (isset($id)) echo $id?></span>
        </div>
    </div>
    
  
    <!-- The page(s) of single publication -->
    <div id="rendered-pages">

    <?php if(isset($rendered_content)) foreach($rendered_content as $rendered_single) echo $rendered_single;?>

    </div><!-- /rendered-pages -->
</div>