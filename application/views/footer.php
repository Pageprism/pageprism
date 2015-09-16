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
</div>	

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script> 
	<script src="<?php echo base_url();?>assets/js/shelf.js?v=2"></script>
   	<script src="<?php echo base_url();?>assets/js/waypoints.min.js"></script>
   	<script src="<?php echo base_url();?>assets/js/waypoints-sticky.min.js"></script>    
    <script src="<?php echo base_url();?>assets/audiojs/audio.min.js"></script>
    <script>
        function load_page_content(id,page_n,div_id,direction,clicked) {
            if (direction == "up") {
                $("#page_"+div_id).before('<div class="row-fluid single-page" id="page_'+page_n+'">LOADING '+page_n+'</div>')
            }
            var form_data = {
                id : id,
                page_n : page_n,
                type: "page",
            };
            $.ajax({
                url: "/index.php/book/load_pages_js",
                type: 'POST',
                async: true,
                data: form_data,
                success: function(data) {
                    if (direction == "down") {
                        $("#page_"+div_id).replaceWith(data);
                    } else {
                        $("#page_"+(div_id-1)).replaceWith(data);
                    }
                    
                    <?php if (isset($page)) {?>
                        // Disable autoscroll if user clicks cover
                        if (clicked != "clicked") {
                            $("img.rendered-page-single").load(function() {
                                $('html, body').scrollTop( $("#page_<?=$page?>").offset().top );                       
                            });                               
                        }
                     
                    <?php }?>                


                    // Click Pagenumber
                    $('.share-part').hide();

                }
            });
        }
	$( document ).ready(function() {

        $(document).on('click','span.pagenumber', function(){
            $(this).parent().children('.share-part').toggle();
        });
        $(document).on('click','#loadmore', function(){
            loadmore();
        });

        <?php if (isset($page)) {?>
        function loadmore() {
            $("#loadmore").remove();
            if (<?php if(isset($page)) echo $page?> > 1) {
                firstrun = true;
                for (var i=<?php if(isset($page)) echo $page?>-1;i>0;i--) {
                    if (firstrun) {
                        load_page_content(<?php if(isset($book_id)) echo $book_id?>,i,<?php if(isset($page)) echo $page?>,'up'); 
                        firstrun = false;
                       // $('html, body').scrollTop( $("#page_<?=$page?>").offset().top );
                    } else {
                        load_page_content(<?php if(isset($book_id)) echo $book_id?>,i,(i+1),'up');
                        //$('html, body').scrollTop( $("#page_<?=$page?>").offset().top );
                    }
                }
            }                    
        }
        <?php } ?>

        <?php if (isset($totalpages)) { ?>
	    if(window.location.href.indexOf("book") > -1) {
            $('html, body').scrollTop( $("#page_<?php if(isset($page)) echo $page?>").offset().top );
            if (<?php if(isset($totalpages)) echo $totalpages?> > 1) {
                //alert("ping1");
                if (<?php if(isset($page)) echo $page?> > 1) {
                    //alert("ping2");
                    $("#page_<?php if(isset($page)) echo $page?>").before('<div id="loadmore" >Load previous pages</div>');    
                }
                
                for (var i=<?php if (isset($page)) echo $page;?>+1;i<=<?php if(isset($totalpages)) echo $totalpages?>;i++) {
                    $("#rendered-pages").append('<div class="row-fluid single-page" id="page_'+i+'">LOADING #'+i+'</div>');
                    load_page_content(<?php if(isset($book_id)) echo $book_id?>,i,i,'down');
                }

                if (<?php if (isset($page)) echo $page;?> == <?php if(isset($totalpages)) echo $totalpages;?>) {
                    $('.share-part').hide();
                }
            }
                $(".book-content-separator").show();
	    }
        <?php } ?>

        <?php if(isset($format_music) == "yes") {?>
        if(window.location.href.indexOf("music") > -1) {
                      audiojs.events.ready(function() {
                        var as = audiojs.createAll();
                      });
                    // Click Pagenumber
                    $('.share-part').hide();
                    $(".book-content-separator").show();
        }
        <?php } ?>

         if(window.location.href.indexOf("epub") > -1) {
             // Click Pagenumber
             $('.share-part').hide();
             $(".book-content-separator").show();
        }

    });
	</script>


  </body>
</html>
