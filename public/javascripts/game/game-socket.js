//TODO remmeber to minify the file before you check it!

var socket = io();

socket.emit('room', 1234);

socket.on('selected', function(num){
  console.log('selected: '+num);
  $('#num'+num).removeClass("unanswered");
  $('#num'+num).addClass("selected");
});

socket.on('unanswered', function(num){
  console.log("unanswered: "+num);
  $('#num'+num).removeClass("selected");
  $('#num'+num).addClass("unanswered");
});

 socket.on('correct', function(num){
   console.log("correct: "+num);
   $('#num'+num).removeClass("selected");
   $('#num'+num).addClass("correct");
 });

 socket.on('wrong', function(num){
   console.log("wrong: "+num);
   $('#num'+num).removeClass("selected");
   $('#num'+num).addClass("wrong");
 });
