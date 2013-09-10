    <!-- Footer -->
    <div class="footer">
        <a href="#" id="footer-to-top">eSamiszat-Shelf.cc - To top</a>
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
	<script src="<?php echo base_url();?>assets/js/shelf.js"></script>
   	<script src="<?php echo base_url();?>assets/js/waypoints.min.js"></script>
   	<script src="<?php echo base_url();?>assets/js/waypoints-sticky.min.js"></script>    
    <script src="<?php echo base_url();?>assets/audiojs/audio.min.js"></script>
    <script>
	$( document ).ready(function() {


        // "Back to shelves"
		$('#scroll-to-top').waypoint('sticky');
		$('#scroll-to-top').click( function() {
			$("html, body").animate({ scrollTop: 0 }, "fast")	
		})


        function load_page_content(id,page_n,div_id,direction,clicked) {
            if (direction == "up") {
                $("#page_"+div_id).before('<div class="row-fluid single-page" id="page_'+page_n+'">LOADING '+page_n+'</div>')
            }
            var form_data = {
                id : id,
                page_n : page_n,
                music : "0",
                download : "0"
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
        $(document).on('click','span.pagenumber', function(){
            $(this).parent().children('.share-part').toggle();
        });   

        $(document).on('click','#loadmore', function(){
            loadmore();
        });

        <? if (isset($page)) {?>
        function loadmore() {
            $("#loadmore").remove();
            if (<? if(isset($page)) echo $page?> > 1) {
                firstrun = true;
                for (var i=<? if(isset($page)) echo $page?>-1;i>0;i--) {
                    if (firstrun) {
                        load_page_content(<? if(isset($book_id)) echo $book_id?>,i,<? if(isset($page)) echo $page?>,'up'); 
                        firstrun = false;
                       // $('html, body').scrollTop( $("#page_<?=$page?>").offset().top );
                    } else {
                        load_page_content(<? if(isset($book_id)) echo $book_id?>,i,(i+1),'up');
                        //$('html, body').scrollTop( $("#page_<?=$page?>").offset().top );
                    }
                }
            }                    
        }
        <?php } ?>

        <?php if (isset($totalpages)) { ?>
	    if(window.location.href.indexOf("book") > -1) {
            $('html, body').scrollTop( $("#page_<? if(isset($page)) echo $page?>").offset().top );
            if (<? if(isset($totalpages)) echo $totalpages?> > 1) {
                //alert("ping1");
                if (<? if(isset($page)) echo $page?> > 1) {
                    //alert("ping2");
                    $("#page_<? if(isset($page)) echo $page?>").before('<div id="loadmore" >Load previous pages</div>');    
                }
                
                for (var i=<?php if (isset($page)) echo $page;?>+1;i<=<? if(isset($totalpages)) echo $totalpages?>;i++) {
                    $("#rendered-pages").append('<div class="row-fluid single-page" id="page_'+i+'">LOADING #'+i+'</div>');
                    load_page_content(<? if(isset($book_id)) echo $book_id?>,i,i,'down');
                }

                if (<?php if (isset($page)) echo $page;?> == <? if(isset($totalpages)) echo $totalpages;?>) {
                    $('.share-part').hide();
                }
            }
                $(".hint").show();
                $("#scroll-to-top").show();
	    }
        <?php } ?>

        <?php if(isset($format_music) == "yes") {?>
        if(window.location.href.indexOf("music") > -1) {
                      audiojs.events.ready(function() {
                        var as = audiojs.createAll();
                      });
                    // Click Pagenumber
                    $('.share-part').hide();
                    $(".hint").show();
                    $("#scroll-to-top").show();
        }
        <?php } ?>

         if(window.location.href.indexOf("epub") > -1) {
             // Click Pagenumber
             $('.share-part').hide();
             $(".hint").show();
             $("#scroll-to-top").show();
        }



    $(".single-cover").click(function(){
        $(".hint").show();
        $("#scroll-to-top").show();
        $("#rendered-pages").empty();
        id = $(this).attr("id");
        $(".publication-header .title").html($(this).attr("title"));
        $(".publication-header .author").html($("#"+id+" .author").html());
        $(".publication-header .timestamp").html($("#"+id+" .timestamp").html());

        $('html, body').animate({
                scrollTop: $(".hint").offset().top-50
        }, "fast");

        if ($("#"+id+" .music-icon").length) {
            music = "1";
        } else {
            music = "0";
        }

        if ($("#"+id+" .epub-icon").length) {
            download = "1";
        } else {
            download = "0";
        }        

        var form_data = {
            id : id,
            page_n : "all",
            music : music,
            download : download
        };

        $.ajax({
            url: "/index.php/book/load_pages_js",
            type: 'POST',
            async: true,
            data: form_data,
            success: function(data) {

                if (download == "1") {
                    $("#rendered-pages").append(data);
                    // Click Pagenumber
                    $('.share-part').hide();
                }
                else if (music == "1") {
                    $("#rendered-pages").append(data);
                      audiojs.events.ready(function() {
                        var as = audiojs.createAll();
                      });
                    // Click Pagenumber
                    $('.share-part').hide();
                } else {
                    for (var i=1;i<=data;i++) {
                        $("#rendered-pages").append('<div class="row-fluid single-page" id="page_'+i+'">LOADING #'+i+'</div>');
                        load_page_content(id,i,i,'down','clicked');
                    }                    
                }

            }
        });

    });

        // Page share elements

        // Facebook
        $(document).on('click','.share-fb', function(){
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            url = $(this).attr("href");
            title = $(this).attr("rel");

            FB.ui(
                {
                    method: 'feed',
                    name: title,
                    link: url,
                    picture: '',
                    caption: "eSamiszat-Shelf",
                    description: "Read more...",
                    message: ''
                });

        });   

		// Click "Show Covers"
		$('.control-covers').click( function() {
            event.preventDefault();
			$('.control-table').removeClass('active');
			$('.control-covers').addClass('active');
			$('#covers').removeClass('list-table');
			$('#covers').addClass('list-cover');
            $('.single-cover img').css({width: '75', height: '110'})
		});

		// Click "Show downloads"
		$('.control-table').click( function() {
            event.preventDefault();
			$('.control-covers').removeClass('active');
			$('.control-table').addClass('active');
			$('#covers').removeClass('list-cover');
			$('#covers').addClass('list-table');
            $('.single-cover img').css({width: '35', height: '51'})
		});


    });
	</script>


  </body>
</html>