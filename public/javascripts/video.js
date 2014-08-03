var PLAYER_COUNT = 5;
var currentPlayerIndex = 0;
var players = [];
var eventIndex = 0;
var events = [];
var playCount = 0;

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
  this.state = 0; // 0 - Default
                  // 3 - Setting up buffering
                  // 4 - Ready to play
};

Player.prototype.cueNext = function () {
  var event = events.shift();

  if (event == undefined) {
    return;
  }

  playCount++;
  var node = document.getElementById(this.nodeId);
  node.style.zIndex = 10000 -playCount;

  this.state = 3;
  this.player.cueVideoById({
    videoId: event.video_id,
    startSeconds: event.start - 0.03,
    endSeconds: event.end + 0.02,
    suggestedQuality: "240p"
  });
  this.meta = event;
}

Player.prototype.onStateChange = function (newState) {
  switch (newState.data) {
    case YT.PlayerState.ENDED:
      this.cueNext();
      playNext();
      break;
    case YT.PlayerState.PLAYING:
      if (this.state == 3) {
        this.player.pauseVideo();
        this.player.unMute();
      }
      break;
    case YT.PlayerState.PAUSED:
      if (this.state == 3) {
        this.state = 4;
        checkAllReady();
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
  this.cueNext();
}

function checkAllReady() {
  if (players.length == PLAYER_COUNT || events.length == 0) {
    var allReady = true;
    console.log("------------------");
    players.forEach(function(player) {
      console.log(player.state);
      if (player.state != 4) {
        allReady = false;
        return;
      }
    });

    if (allReady) {
      playNext();
    }    
  }
}

function onYouTubeIframeAPIReady() {
  events = input;

  var totalEvents = events.length;
  for (var i = 0; i < Math.min(PLAYER_COUNT, totalEvents); i++) {
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

  var word = currentPlayer.meta ? currentPlayer.meta.word : undefined;
  if (word) {
    if (word == "ummXXX") word = "";
    $("#current-word").html(word);
  }
}
