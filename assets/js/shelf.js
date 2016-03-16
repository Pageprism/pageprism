var currentBook = null;

function openBook(bookId, pageCount, startingPage) {
  if (currentBook == bookId) {
    return;
  }
  if (currentBook) {
    $(document).trigger('shelf:bookClosing', [currentBook]);
  }
  $(".book-content-separator").show();
  $("#covers .single-cover").each(function() {
    var selected = $(this).data('book-id') == bookId;
    $(this).toggleClass('selected', selected);
  });
  $("#rendered-pages").empty();
  currentBook = bookId;
  $(document).trigger('shelf:bookOpening', [bookId]);

  startingPage = startingPage || 1;

  var loadedCount = 0;
  var onLoad = function() {
    loadedCount++;
    if (loadedCount == pageCount-(startingPage-1)) {
      $(document).trigger('shelf:bookOpened', [bookId]);
    }
  };

  for (var i=startingPage;i<=pageCount;i++) {
    var page_element = $('<div class="single-page" id="page_'+i+'">LOADING #'+i+'</div>');
    $("#rendered-pages").append(page_element);

    page_element.loadPage(bookId, i, onLoad);
  }

  if (startingPage > 1) {
    var loadMore = $('<div id="loadmore" >Load previous pages</div>');    
    $("#rendered-pages").prepend(loadMore);
    loadMore.click(function(){
      var scrollToCurrent = function() {
        scrollToPage(startingPage);
      };

      for (var i=0; i < pageCount;i++) {
        var page_element = $('<div class="single-page" id="page_'+i+'">LOADING #'+i+'</div>');
        loadMore.before(page_element);
        page_element.loadPage(bookId, i, scrollToCurrent);
      }
      loadMore.remove();
    });
  }
  $('#mainmenu').load("/index.php/ajax/load_menu", {book: bookId}, function() {
    $('#mainmenu').perfectScrollbar('update');
  });
}

$.fn.loadPage = function(bookId, page, callback) {
  var els = this;
  $.ajax({
    url: "/index.php/ajax/load_pages",
    type: 'POST',
    async: true,
    data: {
      id : bookId,
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
          };
          
          var img = $(this).find('img');
          if (img.length) {
            img.on('load', fun).each(function() {
              if (this.complete) fun();
            });
          } else {
            fun();
          }
        }
        
        $(this).trigger('shelf:pageLoaded', [bookId, page]);
      });


      if ($('.page-share.open').length === 0) {
        $('.page-share:first').addClass('open');
      }
      
    }
  });

  return this;
};

function scrollToPage(page) {
  $('html, body').animate({
    scrollTop: $("#page_"+page).offset().top
  }, "fast");
}

$(function() {
  $(document).on('click','.pagenumber', function(){
    $(this).parent().toggleClass('open');
  });
  $(document).on('click','#contents', function(e){
    var target = $(e.target);
    if (target.is('.page-share') || target.parents('.page-share').length > 0) {
      return;
    }
    $(this).parent().find('.page-share').removeClass('open');
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
    var bookId = linkElem.data('book-id');
    if (currentBook == bookId) {
      playlist.playPause();
    } else {
      openBook(bookId, pages);
  
      if (scrollToBook) {
        $('html, body').animate({
          scrollTop: $(".book-content-separator").offset().top
        }, "fast");
      }
    }
  }

  var href = location.pathname;
  $(".single-cover").click(function(){
    _gaq.push(['_trackEvent', 'Covers', 'Click-to-open', $(this).data('book-name')]);
    openBookLink($(this), true);
  });

  //Auto open a book if one's not open yet and some books exist
  if ($('.single-cover.selected').length === 0) {
    var firstBook = $('.single-cover:first');
    if (firstBook.length === 0) return;
    openBookLink(firstBook, false);
  }

  $(document).on('audiojs:play', function(event, audiojs) {
    $("#covers .single-cover.selected").addClass('playing');
  });
  $(document).on('audiojs:pause', function(event, audiojs) {
    $("#covers .single-cover.selected").removeClass('playing');
  });

});
