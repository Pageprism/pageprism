$(function() {
  var brand = $('#mainlogo');
  var container = $('#book_info');
  var currentBook = null;
  var template = null;

  function loadBookInfo(info) {
    function fill() {
      var rendered = template(info);
      container.html(rendered);
      $("body").addClass("has_book_info");
    }
    if (!template) {
      $.get('/assets/handlebars/book_info.handlebars', function(tmpl) {
        template = Handlebars.compile(tmpl);
        fill();
      });
    } else {
      fill();
    }

  }

  brand.click(function(e) {
    if (!currentBook) return true;

    e.preventDefault();
    $("body").toggleClass("book_info_open");
  });
  $(document).on('shelf:bookClosing', function(event, bookId) {
    brand.find('.text').text('PageShare'); 
    container.empty();
    $("body").removeClass("has_book_info book_info_open");
    currentBook = null;
  });
  $(document).on('shelf:bookOpening', function(event, bookId) {
    currentBook = bookId;
    $.ajax({
      url: "/index.php/ajax/load_book",
      type: 'POST',
      async: true,
      data: {id : bookId},
      success: function(data) {
        if (!data.book) return;
        brand.find('.text').text(data.book.book_name); 
        loadBookInfo(data);
      }
    });
  });
});
