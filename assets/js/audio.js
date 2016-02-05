(function() {
  var currentAudio = null;
  
  //Push function to global namespace
  loadAudio = function(elements) {
    audiojs.events.ready(function() {
      elements.filter(":not(.audioloaded)").addClass('audioloaded').each(function() {
        var ajs = audiojs.create(this, {
          css: null,
          play: onPlay,
          trackEnded: advanceTrack
        });
        //We need to access the element cloned by audiojs instead of the original :'(
        $(ajs.element).data('audiojs', ajs);
      });
    });
  }
  
  function onPlay() {
    //Debug purposes
    currentlyPlayingAudio = this;
    //Replicate audiojs internal stuff
    var player = this.settings.createPlayer;
    audiojs.helpers.addClass(this.wrapper, player.playingClass);

    if (currentAudio !== null && currentAudio != this) {
      currentAudio.pause();
    }
    currentAudio = this;
  }
  function advanceTrack() {
    var currentAudio = this.element;
    var audios = $('audio');
    var nextIndex = audios.index(currentAudio) + 1;
    
    if (nextIndex >= audios.length) {
      nextIndex = 0;
    }
    if (nextIndex == 0) return;
    
    var nextAudio = audios.eq(nextIndex).data('audiojs');
    nextAudio.seekTo(0);
    nextAudio.play();
  }

})();
