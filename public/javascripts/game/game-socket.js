//TODO remmeber to minify the file before you check it!

var socket = io();

socket.on('selectednum', function(num){
  console.log('reciecved: '+num);
  $('#num'+num).removeClass("notanswered");
  $('#num'+num).addClass("selected");
});

socket.on('notanswered', function(num){
  console.log("notanswered: "+num);
  $('#num'+num).removeClass("selected");
  $('#num'+num).addClass("notanswered");
});
