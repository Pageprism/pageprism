Handlebars.registerHelper('shorten', function(str) {
  if (str && str.length > 40) {
    str = str.slice(0,37)+"...";
  }
  return str;
});

function scrollToPage(page) {
  $('html, body').animate({
    scrollTop: $("#page_"+page).offset().top
  }, "fast");
}

$(function() {
  /* Support for image loading placeholders */
  var placeHolder = (function() {
    var placeholders = {};
    var svgSupport = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
    var canvas = document.createElement('canvas');
    var canvasSupport = canvas.getContext && canvas.toDataURL('image/png').indexOf('data:image/png') != -1;
    
    if (svgSupport) {
      var svg = Handlebars.compile('<?xml version="1.0" standalone="no"?><svg width="{{w}}" height="{{h}}" viewBox="0 0 {{w}} {{h}}" xmlns="http://www.w3.org/2000/svg" version="1.1"><text font-size="30" font-family="Open Sans" y="60"><tspan x="{{m}}" text-anchor="middle">Loading...</tspan></text></svg>');

      return function placeHolder(img) {
        var w = img.width;
        var h = img.height;
        var key = w+"x"+h;

        if (!placeholders[key]) {
          placeholders[key] = 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg({ w: w,h: h, m: w/2 }));
        }
        return placeholders[key];
      };
      
    } else if (canvasSupport) {
      var ctx = canvas.getContext ? canvas.getContext('2d') : {};

      return function placeHolder(img) {

        var w = img.width;
        var h = img.height;
        var key = w+"x"+h;

        if (!placeholders[key]) {
          canvas.width = w;
          canvas.height = h;
          ctx.fillStyle = 'transparent';
          ctx.fillRect(0, 0, w, h);
          ctx.font="30px Open Sans"; 
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.fillText("Loading...",w/2,60);
          placeholders[key] = canvas.toDataURL('image/png');
        }
        return placeholders[key];
      };
    } else {
      var empty = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      return function() { return empty; };
    }
  })();

  var currentBook = null;
  var bookTemplate = Pageshare.Templates['assets/handlebars/book_pages.handlebars'];
  var base_url = {base_url: $('link[rel="top"]').attr('href')};

  openBook = function openBook(bookId, startingPage, callback) {
    if (currentBook == bookId) {
      return;
    }
    startingPage = startingPage || 1;

    if (currentBook) {
      $(document).trigger('shelf:bookClosing', [currentBook]);
    }
    currentBook = bookId;

    $("#shelf .cover").each(function() {
      $(this).toggleClass('selected', $(this).data('book-id') == bookId);
    });
    $("#ajax-content").empty();
    $(document).trigger('shelf:bookOpening', [bookId]);

    $.ajax({
      url: "/index.php/ajax/load_book",
      type: 'POST',
      data: {id : bookId},
    }).done(function(info) {
      if (!info.book) return;

      var rendered = $(bookTemplate($.extend(info, base_url)));
      rendered.find('img').each(function() {
        this.src = placeHolder(this);
      });
      $('#ajax-content').html(rendered);
      $('.single-page img').lazyload({
        threshold: $(window).height()*5,
      });
      $('.single-page:visible:first .page-share').addClass('open');

      $(document).trigger('shelf:bookOpened', [bookId, info]);
      if (callback) callback();
    });
  };

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

  function openBookLink(linkElem, scrollToBook, pageNumber) {
    var bookId = linkElem.data('book-id');
    if (currentBook == bookId) {
      playlist.playPause();
    } else {
      openBook(bookId);
  
      if (scrollToBook) {
        $('html, body').animate({
          scrollTop: $(".book-content-separator").offset().top
        }, "fast");
      }
    }
  }

  $("#shelf .cover").click(function(){
    _gaq.push(['_trackEvent', 'Covers', 'Click-to-open', $(this).data('book-name')]);
    openBookLink($(this), true);
  });
  if ($('#shelf').is('.editable')) {
    $("#shelf").sortable({
      cancel: ".add-book",
      stop: function(e, ui) {
        var shelf_id = $('#shelf').data('shelf-id');
        var documents = [];
        $("#shelf .document").each(function() {
          documents.push($(this).data('book-id'));
        });
        $.post('/shelf/'+shelf_id+'/reorder', {order: documents.join(",")});
      },
    });
  }

  //Auto open a book if one's not open yet and some books exist
  if ($('.cover.selected').length === 0) {
    var firstBook = $('.cover:first');
    if (firstBook.length === 0) return;
    openBookLink(firstBook, false);
  }

  $(document).on('audiojs:play', function(event, audiojs) {
    $("#shelf .cover.selected").addClass('playing');
  });
  $(document).on('audiojs:pause', function(event, audiojs) {
    $("#shelf .cover.selected").removeClass('playing');
  });
  $(document).on('pageshare:openingLink', function(event, url) {
    if (currentBook) {
      $(document).trigger('shelf:bookClosing', [currentBook]);
      currentBook = null;
    }
  });

});
