function openBook(bookId, pageCount, startingPage) {
  $(".book-content-separator").show();
  $("#covers .single-cover").each(function() {
    var selected = $(this).data('book-id') == bookId;
    $(this).toggleClass('selected', selected);
  });
  $("#rendered-pages").empty();

  startingPage = startingPage || 1;

  for (var i=startingPage;i<=pageCount;i++) {
    var page_element = $('<div class="single-page" id="page_'+i+'">LOADING #'+i+'</div>');
    $("#rendered-pages").append(page_element);

    page_element.loadPage(bookId, i);
  }

  if (startingPage > 1) {
    var loadMore = $('<div id="loadmore" >Load previous pages</div>');    
    $("#rendered-pages").prepend(loadMore);
    loadMore.click(function(){

      for (var i=0; i < pageCount;i++) {
        var page_element = $('<div class="single-page" id="page_'+i+'">LOADING #'+i+'</div>');
        loadMore.before(page_element);
        page_element.loadPage(bookId, i, function() {
          scrollToPage(startingPage);
        });
      }
      loadMore.remove();
    });
  }
}

$.fn.loadPage = function(book_id, page, callback) {
  var els = this;
  $.ajax({
    url: "/index.php/book/load_pages_js",
    type: 'POST',
    async: true,
    data: {
      id : book_id,
      page_n : page,
    },
    success: function(data) {
      els.each(function() { 
        var el = $(data).contents();
        $(this).empty();
        el.appendTo(this);

        if (callback) {
          var run = false;
          var fun = function() {
            if (!run) {
              callback.apply(el);
              run = true;
            }
          }

          $(this).find('img').on('load', fun).each(function() {
            if (this.complete) fun();
          });
        }
        
        loadAudio(el.find('audio'));
      });


      if ($('.page-share.open').length == 0) {
        $('.page-share:first').addClass('open');
      }
      
    }
  });

  return this;
}

function scrollToPage(page) {
  $('html, body').animate({
    scrollTop: $("#page_"+page).offset().top
  }, "fast");
}

$(function() {
  $(document).on('click','span.pagenumber', function(){
    $(this).parent().toggleClass('open');
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
  function openBookLink(linkElem, scrollToBook, pageNumber) {
    var pages = Math.max(1, parseInt(linkElem.data('book-pages')));
    openBook(linkElem.data('book-id'), pages);
  
    if (scrollToBook) {
      $('html, body').animate({
        scrollTop: $(".book-content-separator").offset().top
      }, "fast");
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
