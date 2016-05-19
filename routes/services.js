module.exports = function(io) {
    var app = require('express');
    var router = app.Router();

    io.on('connection', function(socket){
      screenSocket = socket;
      console.log("screen connected");
      socket.on('room', function(gameId){
        socket.join(gameId);
      })
    });

    router.get('/:gameId/:queId',function(req, res){
      //TODO socket here to paint the question on the screen
      io.sockets.in(req.params.gameId).emit('selected', req.params.queId);
      res.sendStatus(200);
    });

    //TODO change to POST because of the many parameters
    router.get('/answers/:gameId/:queId/:answer',function(req, res){
      console.log("answers");
      if(req.params.answer==1){
        res.send("Correct Answer");
        //screenSocket.to(req.params.gameId).emit('correct', req.params.queId);
        io.sockets.in(req.params.gameId).emit('correct', req.params.queId);
      }else{
        res.send("Wrong Answer");
        io.sockets.in(req.params.gameId).emit('wrong', req.params.queId);
      }
    });


    return router;
}
