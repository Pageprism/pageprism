$(function() {

  var win = $(window);
  var scrollTrigger = 64;

  function toggleMainMenu() {
    openMainMenu(window.localStorage.menuOpen != "true");
  }
  function openMainMenu(toggle) {
    window.localStorage.menuOpen = !!toggle;
    $("body").toggleClass("open-sidebar", !!toggle);
  }

  function updateMenuScrollbar(timeout) {
    setTimeout(function() {
      $('#mainmenu').perfectScrollbar('update');
    }, timeout || 1);
  }

  var lastPosition = 0;
  var timer = null;
  win.scroll(function() {
    var scrolled = win.scrollTop() > 0;
    $("body").toggleClass("scrolled", scrolled);
    
    if (!scrolled) {
      $("body").removeClass("show-navi");
      return;
    }
    var scrollDelta = win.scrollTop() - lastPosition;
    if (scrollDelta > 0) {
      $("body").removeClass("show-navi");
      updateMenuScrollbar(250);

      lastPosition = win.scrollTop();
      clearTimeout(timer);
    } else if (-scrollDelta > scrollTrigger) {
      $("body").addClass("show-navi");
      updateMenuScrollbar(250);

      clearTimeout(timer);
      timer = setTimeout(function() {
        lastPosition = win.scrollTop();
      }, 1000);
    }
  });

  $("#sidebar-toggle").click(function(e) {
    toggleMainMenu();
    e.preventDefault();
  });
  $('#contents').click(function() {
    openMainMenu(false);
  });
  var swipeTreshold = 60;
  $(".navbar, .shelfs-and-covers, #mainmenu, .admin").swipe({
    allowPageScroll: "vertical",
    excludedElements: "button, input, select, textarea, a, .noSwipe, .page-share",
    swipeStatus:function(event, phase, direction, distance, duration, fingers)
    {
      var screenW = $(window).width();
      var x = event.x;
      if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX;
      }

      if (phase=="move" && direction =="left" && screenW-x < swipeTreshold) {
        openMainMenu(true);
        //return false;
      }
      if (phase=="move" && direction =="right" && screenW-x < swipeTreshold+240) {
        openMainMenu(false);
        //return false;
      }
    }
  }); 

  // The front page acts as a "Back to shelves" button
  $('#mainlogo').click(function(e) {
    if ($('.book-content-separator:visible').length === 0) {
      return;
    }
    if (isScrolledToBook()) {
      $("html, body").animate({ scrollTop: 0 }, "fast");
      e.preventDefault();
    }
  });
  //Prevent links without url from reloading stuff
  $(document).on('click', '#mainmenu a', function(e) {
    if ($(this).attr('href') === '') {
      e.preventDefault();
    }
  });
  //Parent links open children
  $(document).on('click', '#mainmenu li.parent > a', function(e) {
    $(this).parent().toggleClass('open');
    e.preventDefault();
    updateMenuScrollbar(450);
  });
  $('#mainmenu').perfectScrollbar();
  window.addEventListener('resize', updateMenuScrollbar);

});
