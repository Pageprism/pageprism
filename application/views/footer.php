
</div>
<!-- Footer -->
    <div class="footer">
        <a href="#" id="footer-to-top">PageShare</a>
            <ul class="nav">
                <?php
                $query = $this->db->query("SELECT id,title,url_title FROM pages");
                    if ($query->num_rows() > 0)
                    {
                        foreach ($query->result_array() as $pages_bottom)
                        {?>
                            <li><a href="/page/<?=$pages_bottom['url_title']?>"><?=$pages_bottom['title']?></a></li>
                        <?php
                        }
                    }
                ?>
            </ul>
    </div>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script> 
    <script src="<?= base_url();?>assets/js/perfect-scrollbar.jquery.min.js"></script>
    <script src="<?= base_url();?>assets/js/jquery.touchSwipe.min.js"></script>
    <script src="<?= base_url();?>assets/js/shelf.js?v=4c"></script>
    <script src="<?= base_url();?>assets/js/navi.js"></script>
   	<script src="<?= base_url();?>assets/js/waypoints.min.js"></script>
   	<script src="<?= base_url();?>assets/js/waypoints-sticky.min.js"></script>    
    <script src="<?= base_url();?>assets/audiojs/audio.min.js"></script>
    <script>
        function load_page_content(id,page_n,div_id,direction,clicked) {
            if (direction == "up") {
                $("#page_"+div_id).before('<div class="row-fluid single-page" id="page_'+page_n+'">LOADING '+page_n+'</div>')
            }
            var form_data = {
                id : id,
                page_n : page_n,
            };
            $.ajax({
                url: "/index.php/book/load_pages_js",
                type: 'POST',
                async: true,
                data: form_data,
                success: function(data) {
                    var page;
                    if (direction == "down") {
                        page = $("#page_"+div_id);
                    } else {
                        page = $("#page_"+(div_id-1));
                    }
                    page.replaceWith(data);

                    audiojs.events.ready(function() {
                      var audioTags = $('audio:not(.audioloaded)').addClass('audioloaded');
                      audioTags.each(function() {
                        var as = audiojs.create(this, {css: null});
                      });
                    });

                    if ($('.share-part:visible').length == 0) {
                      var img = $('span.pagenumber:first').parents('.single-page').find('img');
                      img.one("load", function() {
                        $('span.pagenumber:first').click();
                      }).each(function() {
                        if(this.complete) $('span.pagenumber:first').click();
                      });
                    }
                    
                    <?php if (isset($page)) {?>
                        // Disable autoscroll if user clicks cover
                        if (clicked != "clicked") {
                            $("img.rendered-page-single").load(function() {
                                $('html, body').scrollTop( $("#page_<?=$page?>").offset().top );                       
                            });                               
                        }
                     
                    <?php }?>                
                }
            });
        }
  <?php if (isset($book_id)): ?>
	$( document ).ready(function() {
        <?php if (isset($page)) {?>

        $(document).on('click','#loadmore', function(){
            loadmore();
        });

        function loadmore() {
            $("#loadmore").remove();
            if (<?= $page?> > 1) {
                firstrun = true;
                for (var i=<?= $page?>-1;i>0;i--) {
                    if (firstrun) {
                        load_page_content(<?= $book_id?>,i,<?= $page?>,'up'); 
                        firstrun = false;
                    } else {
                        load_page_content(<?= $book_id?>,i,(i+1),'up');
                    }
                }
            }                    
        }
        <?php } ?>

        <?php if (isset($totalpages) && isset($page)) { ?>
          $('html, body').scrollTop( $("#page_<?= $page?>").offset().top );
          if (<?= $totalpages?> > 1) {
            if (<?= $page?> > 1) {
              $("#page_<?= $page?>").before('<div id="loadmore" >Load previous pages</div>');    
            }

            for (var i=<?= $page;?>+1;i<=<?= $totalpages?>;i++) {
              $("#rendered-pages").append('<div class="row-fluid single-page" id="page_'+i+'">LOADING #'+i+'</div>');
              load_page_content(<?= $book_id?>,i,i,'down');
            }

            $(".book-content-separator").show();
          }
        <?php } ?>

  });
  <?php endif; ?>
	</script>


  </body>
</html>
