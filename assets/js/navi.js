(function() {
  var win = $(window);
  var navi = $('.navbar');
  var menu = $('#mainmenu');
  var naviShown = null;
  var navH = navi.height();
  var scrollTrigger = 64;

  function updateMenuScrollbar(timeout) {
    setTimeout(function() {
      $('#mainmenu').perfectScrollbar('update');
    }, timeout || 1);
  }

  function hideNavi() {
    if (naviShown === false) return;
    naviShown = false;
    menu.animate({top: 0}, 200).css({paddingBottom: 0});
    navi.animate({top: -navH}, 200, function() {
      navi.removeClass('navbar-fixed').css('top', 0);
      updateMenuScrollbar();
    });
  }
  function showNavi() {
    if (naviShown === true) return;
    naviShown = true;
    navi.css('top', -navH).addClass('navbar-fixed').animate({top: 0}, 200);
    menu.animate({top: navH-1}, 200).css({paddingBottom: navH-1});
    updateMenuScrollbar();
  }

  var lastPosition = 0;
  var timer = null;
  win.scroll(function() {
    if (!isScrolledToBook()) {
      navi.removeClass('navbar-fixed').css('top', 0);
      return;
    }
    var scrollDelta = win.scrollTop() - lastPosition;
    if (scrollDelta > 0) {
      hideNavi();
      lastPosition = win.scrollTop();
      clearTimeout(timer);
    } else if (-scrollDelta > scrollTrigger) {
      showNavi();
      clearTimeout(timer);
      timer = setTimeout(function() {
        lastPosition = win.scrollTop();
      }, 1000);
    }
  });

  $("#sidebar-toggle").click(function(e) {
    $('body').toggleClass("open-sidebar");
    e.preventDefault();
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
        $("body").addClass("open-sidebar");
        //return false;
      }
      if (phase=="move" && direction =="right" && screenW-x < swipeTreshold+240) {
        $("body").removeClass("open-sidebar");
        //return false;
      }
    }
  }); 

  // The front page acts as a "Back to shelves" button
  $('#mainlogo').click(function(e) {
    if ($('.book-content-separator:visible').length == 0) {
      return;
    }
    if (isScrolledToBook()) {
      $("html, body").animate({ scrollTop: 0 }, "fast");
      e.preventDefault();
    }
  });
  $('#mainmenu li.parent > a').click(function(e) {
    $(this).parent().toggleClass('open');
    e.preventDefault();
    updateMenuScrollbar(450);
  });
  $('#mainmenu').perfectScrollbar();
  window.addEventListener('resize', function() {
    updateMenuScrollbar();
  });

})();
