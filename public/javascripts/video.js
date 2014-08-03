var PLAYER_COUNT = 5;
var currentPlayerIndex = 0;
var players = [];

var Player = function (node) {
  this.player = new YT.Player(node.id, {
    playerVars: {
      enablejsapi: 1,
      controls: 0,
      showInfo: 0,
      modestBranding: 1
    },
    events: {
      'onStateChange': this.onStateChange.bind(this),
      'onReady': this.onReady.bind(this)
    }
  });
  this.nodeId = node.id;
  this.currentWord = null,
  this.state = 0; // 0 - Default
                  // 3 - Setting up buffering
                  // 4 - Ready to play
};

Player.prototype.cueNext = function () {
  var currentWord = wordBank.shift();

  if (currentWord == undefined) {
    console.log("DONE");
    return;
  }

  var node = document.getElementById(this.nodeId);
  node.style.zIndex = 10000 + wordBank.length;

  currentWord.start = currentWord.start - 0.05;
  currentWord.end = currentWord.end + 0.04;

  this.state = 3;
  this.currentWord = currentWord;
  this.player.cueVideoById({
    videoId: currentWord.video_id,
    startSeconds: currentWord.start,
    endSeconds: currentWord.end,
    suggestedQuality: "240p"
  });
}

Player.prototype.onStateChange = function (newState) {
  switch (newState.data) {
    case YT.PlayerState.ENDED:
      if (wordBank.length > 0) {
        this.cueNext();
      } else {
        var node = document.getElementById(this.nodeId);
        node.style.zIndex = 0;
      }
      setTimeout(playNext, 200);
      break;
    case YT.PlayerState.PLAYING:
      if (this.state == 3) {
        this.player.pauseVideo();
        this.player.unMute();
        this.player.seekTo(this.currentWord.start)
      }
      break;
    case YT.PlayerState.PAUSED:
      if (this.state == 3) {
        this.state = 4;
      }
      break;
    case YT.PlayerState.CUED:
      if (this.state == 3) {
        this.player.mute();
        this.player.playVideo();
      } else {
        this.state = 4;
      }
      break;
  }
}

Player.prototype.onReady = function (e) {
  console.log("READY FOOL");
  console.log(arguments);
  this.cueNext();
}

function onYouTubeIframeAPIReady() {
  wordBank = input;
  console.log(wordBank);

  for (var i = 0; i < PLAYER_COUNT; i++) {
    var playerDiv = document.createElement("div");
    playerDiv.id = "player-"+i;
    playerDiv.className = "video";
    document.getElementById("players").appendChild(playerDiv);

    players.push(new Player(playerDiv));
  }
}

function playNext() {
  var currentPlayer = players[currentPlayerIndex];
  
  if (currentPlayerIndex >= players.length-1) {
    currentPlayerIndex = 0;
  } else {
    currentPlayerIndex++;
  }

  currentPlayer.player.playVideo();
}