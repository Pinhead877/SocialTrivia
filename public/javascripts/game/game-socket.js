var socket = io();

socket.on('selectednum', function(num){
  console.log('reciecved: '+num);
  $('#num'+num).removeClass("notanswered");
  $('#num'+num).addClass("selected");
})
