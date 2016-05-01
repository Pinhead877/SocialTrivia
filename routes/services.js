module.exports = function(io) {
    var app = require('express');
    var router = app.Router();

    io.on('connection', function(socket){

      router.get('/:game/:que',function(req, res){
        var gameId = req.params.game;
        var queId = req.params.que;

        //TODO socket here to paint the question on the screen

        res.sendStatus(200);
      });

      //TODO change to POST because of the many parameters
      router.get('/answers/:gameId/:queId/:answer',function(req, res){
        if(req.params.answer==1){
          res.send("Correct Answer");
          socket.broadcast.emit('correct', req.params.queId);
        }else{
          res.send("Wrong Answer");
          socket.broadcast.emit('wrong', req.params.queId);
        }
      });

    });


    return router;
}
