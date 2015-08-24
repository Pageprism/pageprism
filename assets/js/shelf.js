$(function() {

  // "Back to shelves"
  $('#scroll-to-top').click(function() {
    $("html, body").animate({ scrollTop: 0 }, "fast")	
  });
  $(window).scroll(function() {
    if ($('.book-content-separator:visible').length == 0) {
      $('#scroll-to-top').fadeOut();
      return;
    }

    var wt = $(window).scrollTop();    //* top of the window
    var ot = $('.book-content-separator').offset().top;  //* top of object (i.e. advertising div)
    var nh = $('.navbar').height();

    var showScroll = wt > ot - nh;
    if (showScroll) {
      $('#scroll-to-top').fadeIn();
    } else {
      $('#scroll-to-top').fadeOut();
    }
                  
  });

  $(window).scroll(lazyload);
  lazyload();

  function lazyload(){
    var wt = $(window).scrollTop();    //* top of the window
    var wb = wt + $(window).height();  //* bottom of the window

    $(".single-page").each(function(){
      var ot = $(this).offset().top;  //* top of object (i.e. advertising div)
      var ob = ot + $(this).height(); //* bottom of object

      if(!$(this).attr("loaded") && wt<=ob && wb >= ot){
        //$(this).html("here goes the iframe definition");
        $(this).attr("loaded",true);
      }
    });
  }
  var href = location.pathname;
  $(".single-cover").click(function(){
    $(".book-content-separator").show();
    $("#rendered-pages").empty();
    id = $(this).attr("id");
    $("#book-id-hidden").val(id);
    $("#covers .single-cover").removeClass("selected");
    $(this).addClass("selected");

    $('html, body').animate({
      scrollTop: $(".book-content-separator").offset().top-50
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
    image = window.location.protocol+'//'+window.location.host+"/"+$("#page_1 .rendered-page-single").attr("src");
    id = $("#book-id-hidden").val();

    FB.ui(
      {
      method: 'feed',
      name: title,
      link: url,
      picture: image,
      caption: "eSamiszat-Shelf",
      description: "Read more...",
      message: ''
    },
    function(response) {
      if (response && response.post_id) {
        var form_data = {
          id : id
        }

        $.ajax({
          url: "/index.php/book/counter",
          type: 'POST',
          async: true,
          data: form_data,
          success: function(data) {
          }
        });
      }
    });
  });   

  // Google+
  $(document).on('click','.share-google', function(){
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    window.open(this.href,'share_window', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    id = $("#book-id-hidden").val();
    var form_data = {
      id : id
    }

    $.ajax({
      url: "/index.php/book/counter",
      type: 'POST',
      async: true,
      data: form_data,
      success: function(data) {
      }
    });
  });

  // Twitter
  $(document).on('click','.share-twitter', function(){
    id = $("#book-id-hidden").val();
    var form_data = {
      id : id
    }

    $.ajax({
      url: "/index.php/book/counter",
      type: 'POST',
      async: true,
      data: form_data,
      success: function(data) {
      }
    });
  });

});
