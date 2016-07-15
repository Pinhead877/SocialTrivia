// BASE /gamescreen

module.exports = function(io, mongodb, errors){
   var express = require('express');
   var router = express.Router();
   var mongo = mongodb.MongoClient;

   io.on('connection', function(socket){
      console.log("Connected");
      socket.on('room', function(gameId){
         console.log("room: "+gameId);
         socket.join(gameId);
      });
   });

   router.get('/create',function(req, res){
      res.render('gameScreen/create');
   });

   router.get('/gamestartscreen',function(req, res){
      res.render('gameScreen/gameStart', { game: req.session.gameid });
   });

   router.get('/userexitgame/:gameId', function(req, res){
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }else{
            var gamesDB = db.collection('games');
            var gamesFound = gamesDB.find({ _id: parseInt(req.params.gameId) });
            gamesFound.toArray(function(err, games){
               var modifiedGames = [];
               for(var i=0;i<games[0].players.length;i++){
                  if(games[0].players[i].nickname!=req.session.nickname){
                     modifiedGames[i] = games[0].players[i];
                  }
               }
               gamesDB.updateOne(
                  { _id: games[0]._id },
                  { $set: { players: modifiedGames} }
               );
            });
         }
      });
   });

   router.get('/gethighscores', function(req, res){
      if(req.session.gameid==null){
         res.sendStatus(300);
         return;
      }
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var gamesDB = db.collection('games');
            var gamesFound = gamesDB.find({_id: parseInt(req.session.gameid)});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  if(result.length==0){
                     res.send(errors.UNKNOWN);
                  }else{
                     result[0].players.sort(function(a,b){
                        return b.points - a.points;
                     });
                     res.send(result[0].players);
                  }
               }
               db.close();
            });
         }
      });
   })

   router.get('/startgame', function(req, res){
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }else{
            var gamesDB = db.collection('games');
            var gamesFound = gamesDB.find({ _id: parseInt(req.session.gameid)});
            gamesFound.toArray(function(err, gameSelected){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  gamesDB.updateOne({
                     _id: parseInt(req.session.gameid)
                  },
                  {
                     $set: {
                        isStarted: true,
                        startedOn: new Date(),
                        ending: new Date().addMinutes(gameSelected[0].gameLength)
                     }
                  }, function(err, result){
                     if(err){
                        res.send(errors.UNKNOWN);
                     }else if(result.result.n==0){
                        res.send(errors.DB_OPERATION);
                     }else{
                        res.sendStatus(200);
                        io.sockets.in(req.session.gameid).emit('startgame');
                     }
                     db.close();
                  });
               }
            });
         }
      });
   })


   router.get('/:gameId', function(req, res) {
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var gamesDB = db.collection("games");
            var gamesFound = gamesDB.find({ _id: parseInt(req.session.gameid) });
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  if(result[0]){
                     //extract the time from the milliseconds of the differance
                     var diff = result[0].ending - new Date();
                     var timeLeft = [];
                     diff = Math.floor(diff/1000);
                     for(var i = 0;diff>0;i++){
                        var temp = diff%60;
                        timeLeft[i] = temp;
                        diff = Math.floor(diff/60);
                     }
                     if(timeLeft[0]==null) timeLeft[0] = 0;
                     if(timeLeft[1]==null) timeLeft[1] = 0;
                     if(timeLeft[2]==null) timeLeft[2] = 0;
                     var response = {
                        gameid: result[0]._id,
                        quesNum: result[0].questions.length,
                        title: result[0].name,
                        time: {
                           hours: timeLeft[2],
                           minutes: timeLeft[1],
                           seconds: timeLeft[0]
                        }
                     };
                     res.render('gameScreen/gamescreen', response);
                  }
               }
               db.close();
            });
         }
      });
   });

   router.get('/:gameId/:queId',function(req, res){
      io.sockets.in(req.params.gameId).emit('selected', req.params.queId);
      res.sendStatus(200);
   });

   //TODO change to POST because of the many parameters
   router.get('/answers/:gameId/:queId/:answer',function(req, res){
      if(req.params.answer==1){
         res.send("Correct Answer");
         io.sockets.in(req.params.gameId).emit('correct', req.params.queId);
      }else{
         res.send("Wrong Answer");
         io.sockets.in(req.params.gameId).emit('wrong', req.params.queId);
      }
   });

   router.get('/back/:gameId/:queId', function(req, res){
      io.sockets.in(req.params.gameId).emit('unanswered', req.params.queId);
   });



   return router;
};

/* ========== Private Methods ========== */

Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000) + (60*1000));
   return this;
};

Date.prototype.addMinutes = function(m) {
   this.setTime(this.getTime() + (m*60*1000) + (60*1000));
   return this;
};
