document.addEventListener("DOMContentLoaded", function () {
  // Initialize Video.js
  var currentVideoIndex = 0;
  var errorCount = 0;

  const options = {
    controls: false,
    preload: "none",
    fluid: true,
    liveUI: true,
    techOrder: ["youtube"],
    sources: [{ src: playlist[currentVideoIndex], type: "video/youtube" }],
    poster: "./poster.png",
  };

  var player = videojs("my-video", options, function onPlayerReady() {
    videojs.log("Video player is ready");
    playVideo(); // Start playing the first video
    monitorStream(player); // Monitor the player for errors and other events
  });

  // Play the video at the current index in the playlist
  function playVideo() {
    if (currentVideoIndex === playlist.length) {
      console.log("Playlist restarting");
      currentVideoIndex = 0;
    }
    console.log("Starting video " + currentVideoIndex);
    console.log("Player State: " + player.readyState());

    player.ready(function () {
      player.src({ src: playlist[currentVideoIndex], type: "video/youtube" });
      player.poster("./poster.png");
      player.load();
      player.play();
    });
  }

  // Set up various event listeners for the player
  // Ended event listener is required to advance the playlist
  function monitorStream(player) {
    console.log("Monitoring stream...");
    // Plugin to auto-reload on error.  Needs testing / better handling
    player.reloadSourceOnError({
      getSource: function (reload) {
        console.log("Reloading because of an error");
        errorCount++;
        reload({
          src: playlist[currentVideoIndex],
          type: "application/x-mpegURL",
        });
        if (errorCount > 5) {
          console.log("Error count exceeded. Skipping to next video...");
          currentVideoIndex++;
          errorCount = 0;
        }
      },
      errorInterval: 5,
    });
    player.on("playing", function () {
      console.log("Video is playing.");
    });
    player.on("ratechange", function () {
      //console.log("Rate change");
    });
    player.on("waiting", function () {
      //console.log("Video is waiting.");
    });
    player.on("stalled", function () {
      console.log("Video playback stalled.");
    });
    player.on("suspend", function () {
      console.log("Video playback suspended.");
    });
    player.on("ended", function () {
      console.log("Video " + currentVideoIndex + " ended.");
      currentVideoIndex++;
      playVideo();
    });
  }
});
