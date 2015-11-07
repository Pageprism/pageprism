$(function() {
  
  $('#shelfs ul, .shelfs-and-covers').perfectScrollbar();
  window.addEventListener('resize', function() {
    $('#shelfs ul, .shelfs-and-covers').perfectScrollbar('update');
  });

  var navHeight = $('.navbar-fake').height();
  var navBarContent = $('.navbar-fixed-top > div > div');
  var navMinWidth= navBarContent.outerWidth();
  var navHeight = navBarContent.outerHeight();
  var navPadding = navBarContent.css('padding-top');

  //Top menu zoom hack
  function fixMenuScale(e) {
    return;
    var scale = window.innerWidth/document.documentElement.clientWidth;
    scale = Math.min(scale, 1);
    if (window.innerWidth <= 1024 && window.innerWidth > window.innerHeight) {
      scale *= 0.8;
    }

    navBarContent.css({
      'transform': "scale(" + scale  + ")",
      //'width': navMinWidth / (usesDevilInc ? scale : 1) + "px",
      'transform-origin': "left top"
    });
    $('.navbar-fixed-top > div').css({
      height: navHeight*scale + "px"
    });
    $('.navbar-fake').height(navHeight*scale + "px");
  }
  window.addEventListener('scroll', fixMenuScale);
  window.addEventListener('resize', fixMenuScale);
  fixMenuScale();

  // "Back to shelves"
  $('#mainlogo, #scroll-to-top').click(function(e) {
    if ($('.book-content-separator:visible').length == 0) {
      return;
    }
    var wt = $(window).scrollTop();    //* top of the window
    var ot = $('.book-content-separator').offset().top;  //* top of book
    var nh = $('.navbar').height();

    var scroll = wt > ot - nh;
    if (scroll) {
      $("html, body").animate({ scrollTop: 0 }, "fast");
      e.preventDefault();
    }
  });
  /*
  $(window).scroll(function() {
    if ($('.book-content-separator:visible').length == 0) {
      $('#scroll-to-top').fadeOut();
      return;
    }

    var wt = $(window).scrollTop();    //* top of the window
    var ot = $('.book-content-separator').offset().top;  //* top of book
    var nh = $('.navbar').height();

    var winWidth = window.innerWidth;

    var showScroll = wt > ot - nh;
    if (showScroll) {
      $('#scroll-to-top').fadeIn();
      if (winWidth < 768) {
        $('#top-header .nav').fadeOut();
      }
    } else {
      $('#scroll-to-top').fadeOut();
      $('#top-header .nav').fadeIn();
    }
                  
  });
  */

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
  function openBookLink(linkElem, scrollToBook) {
    $(".book-content-separator").show();
    $("#rendered-pages").empty();
    id = linkElem.attr("id");
    $("#book-id-hidden").val(id);
    $("#covers .single-cover").removeClass("selected");
    linkElem.addClass("selected");
  
    if (scrollToBook) {
      $('html, body').animate({
        scrollTop: $(".book-content-separator").offset().top-50
      }, "fast");
    }

    var bookType = linkElem.data('book-type'); 

    var form_data = {
      id : id,
      type: bookType,
      page_n : "all",
    };

    $.ajax({
      url: "/index.php/book/load_pages_js",
      type: 'POST',
      async: true,
      data: form_data,
      success: function(data) {

        if (bookType == "epub") {
          $("#rendered-pages").append(data);
          // Click Pagenumber
          $('.share-part').hide();
        }
        else if (bookType == "mp3") {
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
  }

  var href = location.pathname;
  $(".single-cover").click(function(){
    _gaq.push(['_trackEvent', 'Covers', 'Click-to-open', $(this).data('book-name')]);
    openBookLink($(this), true);

  });

  //Auto open a book if one's not open yet
  if ($('.single-cover.selected').length == 0) {
    openBookLink($('.single-cover:first'), false);
  }

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
        tickCounter();
      }
    });
  });   

  // Google+
  $(document).on('click','.share-google', function(){
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    window.open(this.href,'share_window', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    tickCounter();
  });

  // Twitter
  $(document).on('click','.share-twitter', tickCounter);

  function tickCounter() {
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
  }

});
