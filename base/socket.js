//TODO change this file - needs to be somewhere else where it can be used by other files

module.exports = function(io){

  io.on('connection', function(socket){
    var numSer = 0;
    console.log("User connected!");

    socket.on('selected', function(num){
      numSer = num;
      socket.broadcast.emit('selectednum', num);
    });

    socket.on('disconnect', function(){
      console.log(numSer);
      socket.broadcast.emit('notanswered', numSer);
    })
  });
};
