module.exports = function(io, mongodb) {
  var app = require('express');
  var router = app.Router();
  var async = require('asyncawait/async');
  var await = require('asyncawait/await');
  var monDB = mongodb.MongoClient;

  var returnData = async(function(data, gameid){
    var checkID = true;
    while(checkID){
      gameid = Math.floor(Math.random()*9999999);
      console.log(gameid);
      var result = await(new Promise(function(){
        data.find({_id:gameid}).toArray(function(err, results){
          if(err){
            return err;
          }
          return results;
        });
      }));
      console.log(result);
      if(result.length==0){
        return "OK";
      }
  }
});

  var checkResults = function (err, result) {
    if(result){
      return result;
    }
    return err;
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
    monDB.connect(url, function(err, db){
      if(err){
        console.log("Error: "+err);
        res.send({ });
      }else{
        console.log("Connected To DB!");
        var data = db.collection("games");
        var result = returnData(data);
        if(result=="OK"){
          res.send();
        }
        console.log(result);
        if(result){
          checkID = false;
          data.insertOne({ _id: gameid});
          res.send({gameId: gameid});
        }
      }
    });
  });

  router.get('/:gameId/:queId',function(req, res){
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
