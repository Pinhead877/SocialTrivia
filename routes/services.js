module.exports = function(io, mongodb) {
    var app = require('express');
    var router = app.Router();

    var url = 'mongodb://127.0.0.1/socialdb';

    io.on('connection', function(socket){
      screenSocket = socket;
      console.log("screen connected");
      socket.on('room', function(gameId){
        socket.join(gameId);
      })
    });

    router.post('/create/game', function(req, res){
      var gameName = req.body.gameName;
      var gameid = Math.random()*1000000;
      console.log(gameid);
    });

    router.get('/:gameId', function(req, res){
      var mongoClient = mongodb.mongoClient;

      mongoClient.connect(url, function(err){
        if(err){
          console.log("Error Connecting to DB: "+err);
        }else{
          console.log("Connected To DB!");
        }
      });
    });

    router.get('/:gameId/:queId',function(req, res){
      //TODO socket here to paint the question on the screen
      io.sockets.in(req.params.gameId).emit('selected', req.params.queId);
      res.sendStatus(200);
    });

    //TODO change to POST because of the many parameters
    router.get('/answers/:gameId/:queId/:answer',function(req, res){
      console.log("Answers");
      if(req.params.answer==1){
        res.send("Correct Answer");
        //screenSocket.to(req.params.gameId).emit('correct', req.params.queId);
        io.sockets.in(req.params.gameId).emit('correct', req.params.queId);
      }else{
        res.send("Wrong Answer");
        io.sockets.in(req.params.gameId).emit('wrong', req.params.queId);
      }
    });

    router.get('/back/:gameId/:queId', function(req, res){
      console.log('Back');
      io.sockets.in(req.params.gameId).emit('unanswered', req.params.queId);
    });


    return router;
}
