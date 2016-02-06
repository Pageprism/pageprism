(function() {
  var currentAudio = null;
  
  //Push function to global namespace
  loadAudio = function(elements) {
    audiojs.events.ready(function() {
      elements.filter(":not(.audioloaded)").addClass('audioloaded').each(function() {

        //Prepare audiojs settings with triggers for jquery events
        var settings = {
          css: null,
        };
        var eventNames = ['trackEnded', 'flashError', 'loadError', 'init', 'loadStarted', 'play', 'pause'];
        $.each(eventNames, function(i, eventName) {
          settings[eventName] = function() {
            //Replicate audiojs internal stuff
            audiojs.settings[eventName].apply(this);
            $(this.element).trigger('audiojs:'+eventName, this);
          };
        });

        //Init audiojs
        var ajs = audiojs.create(this, settings);

        //We need to access the element cloned by audiojs instead of the original :'(
        $(ajs.element).data('audiojs', ajs);
      });
    });
  };
  
  $(document).on('playlist:playPause', function() {
    var playing = currentAudio && currentAudio.playing;
    $(document).trigger(playing ? 'playlist:pause' : 'playlist:play');
  });
  $(document).on('playlist:play', function() {
    if (currentAudio) {
      currentAudio.play();
    } else {
      var firstTrack = $('audio:eq(0)');
      if (firstTrack.length === 0) return;
      
      firstTrack.data('audiojs').play();
    }
  });
  $(document).on('playlist:pause', function() {
    if (currentAudio) {
      currentAudio.pause();
    }
  });
  $(document).on('audiojs:play', function(event, audiojs) {
    //Debug purposes
    currentlyPlayingAudio = audiojs;

    if (currentAudio !== null && currentAudio != audiojs) {
      currentAudio.skipTo(0);
      currentAudio.pause();
    }
    currentAudio = audiojs;
  });
  $(document).on('audiojs:trackEnded', function(event, audiojs) {
    var currentAudio = audiojs.element;
    var audios = $('audio');
    var nextIndex = audios.index(currentAudio) + 1;
    
    if (nextIndex >= audios.length) {
      nextIndex = 0;
    }
    
    var nextAudio = audios.eq(nextIndex).data('audiojs');
    nextAudio.skipTo(0);
    nextAudio.play();
  });

})();
