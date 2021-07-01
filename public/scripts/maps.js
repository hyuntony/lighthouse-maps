/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => {

  $(".totalMapBox").height($(".totalMapBox").width());

  const time = $("#time").val();
  const adjustedTime = timeago.format(time);

  $()

});
