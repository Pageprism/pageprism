var playlist = (function() {
  var currentAudio = null;

  var playlist = {
    repeat: false,
    playPause:  function() {
      var playing = currentAudio && currentAudio.playing;
      if (playing) {
        playlist.pause();
      } else {
        playlist.play();
      }
    },
    play: function() {
      if (currentAudio) {
        currentAudio.play();
      } else {
        var firstTrack = $('audio:eq(0)');
        if (firstTrack.length === 0) return;

        firstTrack.data('audiojs').play();
      }
    },
    pause:  function() {
      if (currentAudio) {
        currentAudio.pause();
      }
    }
  };
  
  $(document).on('shelf:bookOpened', function() {
    var elements = $(this);
    audiojs.events.ready(function() {
      elements.find("audio:not(.audioloaded)").addClass('audioloaded').each(function() {

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
    $('.single-page').one('audiojs:loadStarted', 'audio:eq(0)', playlist.play);
  });
  $(document).on('shelf:bookClosing', function() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
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
    if (nextIndex === 0 && !playlist.repeat) return;
    
    var nextAudio = audios.eq(nextIndex).data('audiojs');
    nextAudio.skipTo(0);
    nextAudio.play();
  });

  return playlist;
})();
