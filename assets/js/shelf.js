function isScrolledToBook() {
  var separator = $('.book-content-separator');
  var wt = $(window).scrollTop();    //* top of the window
  var nh = $('.navbar').height();
  var ot = separator.length ? separator.offset().top : nh;  //* top of book

  return wt > ot - nh;
}

$(function() {
  $('#covers').perfectScrollbar();
  window.addEventListener('resize', function() {
    $('#covers').perfectScrollbar('update');
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
