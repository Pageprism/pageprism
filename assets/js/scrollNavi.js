(function() {
  var win = $(window);
  var navi = $('.navbar');
  var menu = $('#mainmenu');
  var naviShown = null;
  var navH = navi.height();
  var scrollTrigger = 64;

  function hideNavi() {
    if (naviShown === false) return;
    naviShown = false;
    menu.animate({top: 0}, 200);
    navi.animate({top: -navH}, 200, function() {
      navi.removeClass('navbar-fixed').css('top', 0);
    });
  }
  function showNavi() {
    if (naviShown === true) return;
    naviShown = true;
    navi.css('top', -navH).addClass('navbar-fixed').animate({top: 0}, 200);
    menu.animate({top: navH-1}, 200);
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
})();
