document.addEventListener("DOMContentLoaded", function () {
  // Initialize Video.js
  var currentVideoIndex = 0;
  var errorCount = 0;

  const options = {
    controls: false,
    autoplay: true,
    preload: "auto",
    fluid: true,
    liveUI: true,
    techOrder: ["youtube"],
    sources: [{ src: playlist[currentVideoIndex], type: "video/youtube" }],
  };

  var player = videojs("my-video", options, function onPlayerReady() {
    videojs.log("Video player is ready");

    this.play();
    this.on("playing", function () {
      console.log("Video is playing");
      monitorStream(this);
    });

    function monitorStream(player) {
      console.log("Monitoring stream...");

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

      player.on("ratechange", function () {
        console.log("Rate change");
      });
      player.on("waiting", function () {
        console.log("Video is waiting.");
      });
      player.on("stalled", function () {
        console.log("Video playback stalled.");
      });
      player.on("suspend", function () {
        console.log("Video playback suspended.");
      });
      player.on("ended", function () {
        console.log("Video playback ended, current index: " + currentVideoIndex);
        currentVideoIndex++;
        if (currentVideoIndex === playlist.length) {
          currentVideoIndex = 0;
        }
        var nextVideo = playlist[currentVideoIndex];
        this.src({ src: nextVideo, type: "video/youtube" });
        this.play();
      });
    }
  });

  // Function to reload the video stream
  function reloadVideo(player) {
    console.log("Reloading video...");
    player.src(videoSource);
    player.load();
    //player.play();
  }
});
