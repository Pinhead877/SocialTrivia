// BASE /gamescreen

var CORRECT_ANSWER_POINTS = 5;

module.exports = function(io, mongodb, errors){
   var express = require('express');
   var router = express.Router();
   var mongo = mongodb.MongoClient;
   var _ = require('lodash');

   io.on('connection', function(socket){
      console.log("Connected");
      socket.on('room', function(gameId){
         console.log("room: "+gameId);
         socket.join(gameId);
      });
   });

   router.get('/results/:gameid',function(req, res){
      res.render('gameScreen/results', {});
   });


   router.get('/create',function(req, res){
      res.render('gameScreen/create', {});
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
                  if(gameSelected[0].isStarted){
                     if(gameSelected[0].ending - new Date() > 0) {
                        res.sendStatus(200);
                     }else{
                        res.send(errors.GAME_ENDED);
                     }
                     db.close();
                     return;
                  }else{
                     if(gameSelected[0].players == null || gameSelected[0].players.length < 2){
                        res.send(errors.NO_PLAYERS);
                        db.close();
                        return;
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
                  }
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
                  if(result[0].isEnded===true){
                     res.render('gameScreen/results', {});
                  }
                  else if(result[0]){
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
      var gameID = parseInt(req.params.gameId), queID = parseInt(req.params.queId)-1;
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var gamesDB = db.collection("games");
            var gamesFound = gamesDB.find({_id: gameID});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  var question = result[0].questions[queID];
                  if(question.isAnswered){
                     res.send(errors.QUE_ANSWERED); //code: 3001
                  }else if(question.playersTried != null && _.findIndex(question.playersTried, {_id: req.session.userid}) != -1){
                     res.send(errors.QUE_TRIED);
                  }else{
                     io.sockets.in(gameID).emit('selected', queID+1);
                     res.sendStatus(200);
                  }
               }
               db.close();
            });
         }
      });
   });

   router.get('/answers/:gameId/:queId/:answer',function(req, res){
      var gameID = parseInt(req.params.gameId), queID = parseInt(req.params.queId)-1,
      answer = req.params.answer, isCorrect, userID = req.session.userid;
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var gamesDB = db.collection("games");
            var gamesFound = gamesDB.find({_id:parseInt(gameID)});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
                  return;
               }else{
                  var isCorrect = (answer===result[0].questions[queID].answer);
                  res.send(isCorrect);
                  io.sockets.in(gameID).emit((isCorrect)?'correct':'wrong', queID+1);
                  var questionsToSave = result[0].questions;
                  questionsToSave[queID].isAnswered = isCorrect;
                  questionsToSave[queID].answeredBy = (isCorrect)?userID:null;
                  if(questionsToSave[queID].playersTried==null){
                     questionsToSave[queID].playersTried = [];
                  }
                  questionsToSave[queID].playersTried.push({_id: userID});
                  var playersToSave = result[0].players;
                  let playerIndex = _.findIndex(result[0].players, {_id: userID});
                  let pointsMulti = CORRECT_ANSWER_POINTS*result[0].questions[queID].playersTried.length;
                  playersToSave[playerIndex].points += (isCorrect)?pointsMulti:0;
                  gamesDB.updateOne(
                     {_id: parseInt(gameID)},
                     {$set: {
                        questions: questionsToSave,
                        players: playersToSave
                     }
                  }, function(err, result){
                     if(err){
                        console.log(errors.UNKNOWN);
                        console.log(err);
                     }else if(result.result.n==0){
                        console.log(errors.DB_OPERATION);
                        console.log(result.result);
                     }
                     db.close();
                     io.sockets.in(req.params.gameId).emit('pointsUpdated');
                  });
               }
            });
         }
      });
   });

   router.get('/back/:gameId/:queId', function(req, res){
      io.sockets.in(req.params.gameId).emit('unanswered', req.params.queId);
   });

   return router;
};

/* ========== Private Methods ========== */

Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000) + (10*1000));
   return this;
};

Date.prototype.addMinutes = function(m) {
   this.setTime(this.getTime() + (m*60*1000) + (10*1000));
   return this;
};
