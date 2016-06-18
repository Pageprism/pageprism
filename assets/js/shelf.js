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
  var currentBook = null;
  var bookTemplate = $.get({
    url: '/assets/handlebars/book_pages.handlebars',
    dataFilter: function(tmpl) { return Handlebars.compile(tmpl); }
  });
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

    $.when(bookTemplate, $.ajax({
      url: "/index.php/ajax/load_book",
      type: 'POST',
      data: {id : bookId},
    })).done(function(template, info) {
      template = template[0]; info = info[0];
      if (!info.book) return;

      var rendered = template($.extend(info, base_url));
      $('#ajax-content').html(rendered);

      if (startingPage > 1) {
        $('.single-page').each(function() {
          var pageNr = parseInt($(this).data('page-number'), 10);
          if (pageNr < startingPage) $(this).hide();
        });
        var loadMore = $('<div id="loadmore" >Load previous pages</div>');    
        $("#page_"+startingPage).before(loadMore);

        loadMore.click(function(){
          $('.single-page').show();
          scrollToPage(startingPage);
          $('html, body').animate({
            scrollTop: $("#loadmore").offset().top - 100
          }, "fast");
          loadMore.remove();
        });
      }

      $('.single-page:first .page-share').addClass('open');

      $(document).trigger('shelf:bookOpened', [bookId, info]);
      for (var i=startingPage;i<=info.pages.length;i++) {
        $('#page_'+i).trigger('shelf:pageLoaded', [bookId, i]);
      }
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
