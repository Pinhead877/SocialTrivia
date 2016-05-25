module.exports = function(io, mongodb) {
  var app = require('express');
  var router = app.Router();

  var checkResults = function (err, result) {
    console.log("IN");
    if(err){
      res.send({error: "DB"});
    }else if(result.length>0){
      res.send({error: "EXISTS"});
      gameid = Math.floor(Math.random()*9999999);
    }else{
      checkID = false;
      data.insertOne({_id: gameid});
      res.send({ gameId: gameid });
    }
    db.close();
  }

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
    var gameid, checkID;
    mongodb.MongoClient.connect(url, function(err, db){
      if(err){
        console.log("Error: "+err);
        res.send({ });
      }else{
        console.log("Connected To DB!");
        var data = db.collection("games");
        gameid = Math.floor(Math.random()*9999999);
        checkID = true;
          console.log(gameid);
          data.find({ _id : gameid }).addCursorFlag('awaitData', true).toArray(checkResults);
    }
  });
});

router.get('/:gameId', function(req, res){

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
