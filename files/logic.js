function onYouTubePlayerReady(playerId) {
  ytplayer = document.getElementById('ytplayorz');
  ytplayer.addEventListener('onStateChange', 'handleStateChange');
  ytplayer.addEventListener('onError', 'handleError');
  ytplayer.playVideo();
}

var interval = null;
function pollForSong(success) {
  function gotSong(songId) {
    if (songId) {
      clearInterval(interval);
      interval = null;
      success(songId);
    }
  }
  if (!interval) {
    interval = setInterval(function(){
      $.get('nextvideo', gotSong);
    }, 2000);
  }
}

// dunno why i have to wrap this in another function but i do
function playSongWrapper(songId) {
  ytplayer.loadVideoById(songId);
}

function handleError(err) {
  pollForSong(playSongWrapper);
}

function handleStateChange(newState) {
  if (newState === 0) {
    pollForSong(playSongWrapper);
  }
}
