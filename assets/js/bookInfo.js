$(function() {
  var brand = $('#mainlogo');
  var container = $('#book_info');
  var infoTemplate = Pageshare.Templates['assets/handlebars/book_info.handlebars'];

  brand.click(function(e) {
    if ($("body").is('.has_book_info')) {
      e.preventDefault();
      $("body").toggleClass("book_info_open");
    }
  });
  $(document).on('shelf:bookClosing', function(event, bookId) {
    brand.find('.text').text('PageShare'); 
    container.empty();
    $("body").removeClass("has_book_info book_info_open");
  });
  $(document).on('shelf:bookOpened', function(event, bookId, data) {
    if (!data.book) return;

    brand.find('.text').text(data.book.book_name); 
    var rendered = infoTemplate(data);
    container.html(rendered);
    $("body").addClass("has_book_info");
  });
  $('#contents').click(function() {
    $("body").removeClass("book_info_open");
  });
});
