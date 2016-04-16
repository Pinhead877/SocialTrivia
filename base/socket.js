module.exports = function(io){
  io.on('connection', function(socket){
    console.log("User connected!");

    socket.on('selected', function(num){
      console.log("recieved: "+num);
      socket.broadcast.emit('selectednum', num);
    });
  });
};
