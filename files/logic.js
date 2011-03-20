function onYouTubePlayerReady(playerId) {
  ytplayer = document.getElementById('ytplayorz');
  ytplayer.addEventListener('onStateChange', 'handleStateChange');
  ytplayer.addEventListener('onError', 'handleError');
  handleStateChange(0);
}

var interval = null;
function pollForSong(success) {
  function gotSong(res) {
    if (res) {
      res = JSON.parse(res);
      if (res && res.v) {
        clearInterval(interval);
        interval = null;
        if (res.u) {
          document.getElementById('userId').innerText = 'Requested by: ' + res.u;
        }
        success(res.v);
      }
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
