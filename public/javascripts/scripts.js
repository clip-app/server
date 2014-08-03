$(".chosen-select").chosen();

$("#controls > a").click(function (e) {
  playNext();
  $("#controls").removeClass('pause');
});
