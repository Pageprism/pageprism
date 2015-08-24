$(function() {

  // "Back to shelves"
  $('#scroll-to-top').waypoint('sticky');
  $('#scroll-to-top').click(function() {
    $("html, body").animate({ scrollTop: 0 }, "fast")	
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

  // Page share elements
  // Facebook
  $(document).on('click','.share-fb', function(){
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    url = $(this).attr("href");
    title = $(this).attr("rel");
    image = window.location.protocol+'//'+window.location.host+"/"+$("#page_1 .rendered-page-single").attr("src");
    id = $(".publication-header .book-id-hidden").html();

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
    id = $(".publication-header .book-id-hidden").html();
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
    id = $(".publication-header .book-id-hidden").html();
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
