<!-- Container -->
<div class="container-fluid" id="the-container">
    <div class="row-fluid">

        <!-- Shelfs -->
        <div class="span2" id="shelfs">
            <h2 class="">The Shelves</h2>
            <ul class="">
                <?php
                if (isset($shelf_id)) echo $shelf_id;
                $query = $this->db->query('SELECT * FROM shelf');
                    if ($query->num_rows() > 0)
                    {
                        foreach ($query->result_array() as $shelf)
                        {?>
                            <li><a href="/shelf/<?=$shelf['id']?>"><?=$shelf['name']?></a></li>
                        <?php
                        }
                    }
                ?>
            </ul>
        </div>
        
        <!-- Covers -->
        <div class="span10 well well-small" id="covers-controls">
            View: <a class="control-covers active" href="#">Covers</a> <a class="control-table" href="#">Downloads</a>

            <!--
            | Sort by: <a class="control-name active" href="#">Name</a> <a class="control-author" href="#">Author</a> <a class="control-date" href="#">Date</a> -->
        </div>
        
        <!-- Show Covers / Show Table -->
        <div class="span10 list-cover" id="covers"> 
<!--        <div class="span10 list-table" id="covers"> -->


            <?php
            $query = $this->db->query('SELECT * FROM book');

                if ($query->num_rows() > 0)
                {
                    foreach ($query->result_array() as $book)
                    {?>
                        <div class="single-cover thumbnail" id="<?=$book['id']?>">
                            <img src="<?=$book['file_url_cover']?>" alt="" />
                            <div class="caption">
                                <h3 class="title"><?=$book['meta']?></h3>

                                <!-- Additional "Downloads" -stuff  -->
                                <a href="#" class="download-pdf table-view-only"><i class="icon-book"></i> PFD</a>
                                <a href="#" class="download-epub table-view-only"><i class="icon-book"></i> ePub</a>
                            </div>
                       </div>
                    <?php
                    }
                }
            ?>


            <div class="single-cover thumbnail">
        
                <!-- The "Cover" -->
                <img src="application/img/dummy-cover.png" width="75" height="110" alt="Dummy Cover" />
                <div class="caption">
                    <h3 class="title">The Unknown Soldier</h3>
                    <span class="author">Väinö Linna</span>
                    <span class="timestamp">1954</span>
            
                    <!-- Additional "Downloads" -stuff  -->
                    <a href="#" class="download-pdf table-view-only"><i class="icon-book"></i> PFD</a>
                    <a href="#" class="download-epub table-view-only"><i class="icon-book"></i> ePub</a>
        
                </div>
            </div>  

        </div>
    </div>

    <hr id="publication-separator"/>
    <!-- Read / Play area -->

    <!-- The header for single publication -->
    <div class="row-fluid publication-header">
        <div class="span12">
            <h3 class="title">The Unknown Soldier</h3>
            <div id="scroll-to-top"><button class="btn">Back to shelves</button></div>
<!--            <ul>
                <li><span class="author">Väinö Linna</span></li>
                <li><span class="timestamp">1954</span></li>
                <li><span class="download-title">Download as:</span>
                    <ul>
                        <li><a href="#" class="download-pdf"><i class="icon-book"></i> PFD</a></li>
                        <li><a href="#" class="download-epub"><i class="icon-book"></i> ePub</a></li>
                    </ul></li>
                <li><a href="#" class="share">Share</a></li>
            </ul>
            <div class="share-part">
                <h4>Share this document</h4>
                <a class="social" href="#"><i class="icon-facebook-sign"></i></a>
                <a class="social" href="#"><i class="icon-twitter-sign"></i></a>
                <a class="social" href="#"><i class="icon-google-plus-sign"></i></a>
                <h5>Direct URL</h5>
                <p class="direct-url">www.esamizdat-shelf.cc/document/the-unknown-soldier</p> 
            </div> -->
        </div>
    </div>
    
  
    <!-- The page(s) of single publication -->
    <div id="rendered-pages">    
    
    <i>Ajax content here</i>

    </div><!-- /rendered-pages -->
</div>
<hr />