function isScrolledToBook() {
  var wt = $(window).scrollTop();    //* top of the window
  var ot = $('.book-content-separator').offset().top;  //* top of book
  var nh = $('.navbar').height();

  return wt > ot - nh;
}

$(function() {
  $('#shelfs ul, .shelfs-and-covers').perfectScrollbar();
  window.addEventListener('resize', function() {
    $('#shelfs ul, .shelfs-and-covers').perfectScrollbar('update');
  });
  $(document).on('click','span.pagenumber', function(){
    if ($(this).text() == 'X') {
      $(this).text($(this).data('pagenumber'));
    } else {
      $(this).data('pagenumber', $(this).text());
      $(this).text('X');
    }
    $(this).parent().children('.share-part').toggle();
  });

  // "Back to shelves"
  $('#mainlogo').click(function(e) {
    if ($('.book-content-separator:visible').length == 0) {
      return;
    }
    if (isScrolledToBook()) {
      $("html, body").animate({ scrollTop: 0 }, "fast");
      e.preventDefault();
    }
  });


  $("#sidebar-toggle").click(function(e) {
    $('body').toggleClass("open-sidebar");
    e.preventDefault();
  });
  var swipeTreshold = 60;
  $("body").swipe({
    swipeStatus:function(event, phase, direction, distance, duration, fingers)
    {
      var screenW = $(window).width();
      if (phase=="move" && direction =="left" && screenW-event.x < swipeTreshold) {
        $("body").addClass("open-sidebar");
        return false;
      }
      if (phase=="move" && direction =="right" && screenW-event.x < swipeTreshold+240) {
        $("body").removeClass("open-sidebar");
        return false;
      }
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
    
    var pages = Math.max(1, parseInt(linkElem.data('book-pages')));
    for (var i=1;i<=pages;i++) {
      $("#rendered-pages").append('<div class="row-fluid single-page" id="page_'+i+'">LOADING #'+i+'</div>');
      load_page_content(id,i,i,'down','clicked');
    }
  }

  var href = location.pathname;
  $(".single-cover").click(function(){
    _gaq.push(['_trackEvent', 'Covers', 'Click-to-open', $(this).data('book-name')]);
    openBookLink($(this), true);
  });

  //Auto open a book if one's not open yet and some books exist
  if ($('.single-cover.selected').length == 0) {
    var firstBook = $('.single-cover:first');
    if (firstBook.length == 0) return;
    openBookLink(firstBook, false);
  }

});
