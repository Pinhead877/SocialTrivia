// BASE /gamescreen
"use strict";
var CORRECT_ANSWER_POINTS = 5;

module.exports = function(io, mongodb, errors){
   var express = require('express');
   var router = express.Router();
   var mongo = mongodb.MongoClient;
   var _ = require('lodash');

   io.on('connection', function(socket){
      socket.on('room', function(gameId){
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
      var gameID = parseInt(req.params.gameId);
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }else{
            var gamesDB = db.collection('games');
            var gamesFound = gamesDB.find({ _id: gameID });
            gamesFound.toArray(function(err, games){
               if(err){
                  db.close();
                  console.error(err);
                  return;
               }else{
                  _.remove(games[0].players, {_id: req.session.userid });
                  gamesDB.updateOne(
                     { _id: games[0]._id },
                     { $set: { players: games[0].players} },
                     function(err, result){
                        if(err){
                           console.error(err);
                        }else if(result.result.n===0){
                           console.error("Error removing the player from the list of players");
                        }else{
                           io.sockets.in(gameID).emit('playersLogged');
                        }
                        db.close();
                     });
                  }
               });
            }
         });
      });

      //TODO - send the userid and name of the requested ids
      router.get('/loggedToGameList/:gameid', function(req, res){
         var gameid = parseInt(req.params.gameid);
         mongo.connect(mongodb.urlToDB, function(err, db){
            if(err){
               res.send(errors.DB_CONNECT_ERROR);
               return;
            }else{
               var gamesDB = db.collection('games');
               var gamesFound = gamesDB.find({ _id: gameid});
               gamesFound.toArray(function(err, games){
                  if(err){
                     res.send(errors.UNKNOWN);
                  }else{
                     if(games.length===0){
                        res.send(errors.UNKNOWN);
                     }else{
                        var playersToSend = [];
                        if(games[0].players){
                           var playersInGame = games[0].players;
                           for (var i = 0; i < playersInGame.length; i++) {
                              playersToSend[i] = playersInGame[i];
                           }
                        }
                        res.send(playersToSend);
                     }
                  }
                  db.close();
               });
            }
         });
      });

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
                        if(isGameActive(gameSelected[0])) {
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
      });

      router.post('/entergame', function(req,res){
         var gameID = parseInt(req.body.gamenum), playerID = req.session.userid;
         if(gameID==null){
            res.sendStatus(400);
            return;
         }
         mongo.connect(mongodb.urlToDB, function(err, db){
            if(err){
               res.send(errors.DB_CONNECT_ERROR);
               return;
            }else{
               var gamesDB = db.collection('games');
               var findResult = gamesDB.find({ _id: gameID });
               findResult.toArray(function(err, games){
                  if(err){
                     console.log(err);
                     res.send(errors.UNKNOWN);
                     db.close();
                  }else if(games.length===0){
                     res.send(errors.GAME_NUM_ERROR);
                     db.close();
                  }else if(games[0].isStarted==true && !isGameActive(games[0])){
                     res.send(errors.GAME_ENDED);
                  }else{
                     games[0].players = (games[0].players == null) ? [] : games[0].players;
                     if(playerID === parseInt(games[0].creator.userid)){
                        res.send(errors.CREATOR_IS_PLAYER);
                        db.close();
                     }else if(_.find(games[0].players,{_id: playerID })){
                        res.send(errors.USER_EXITS_IN_GAME);
                        db.close();
                     }else{
                        res.sendStatus(200);
                        io.sockets.in(gameID).emit('playersLogged');
                        games[0].players.push({
                           _id: playerID,
                           nickname: req.session.nickname,
                           points: 0
                        });
                        gamesDB.updateOne(
                           { _id: games[0]._id },
                           { $set: { players: games[0].players } },
                           function(err, result){
                              db.close();
                           }
                        );
                     }
                  }
               });
            }
         });
      });

      router.get('/:gameId', function(req, res) {
         var gameId = parseInt(req.params.gameId);
         mongo.connect(mongodb.urlToDB, function(err, db){
            if(err){
               res.send(errors.DB_CONNECT_ERROR);
               return;
            }
            else{
               var gamesDB = db.collection("games");
               var gamesFound = gamesDB.find({ _id: gameId });
               gamesFound.toArray(function(err, result){
                  if(err){
                     res.send(errors.UNKNOWN);
                  }else{
                     if(result[0]==null){
                        console.log("error game is undefined");
                     }else if(result[0].isStarted==null){
                        res.render('gameScreen/create');
                     }
                     else if(!isGameActive(result[0])){
                        res.render('gameScreen/results', {});
                     }else if(result[0]){
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
                        var statsArr = _.map(result[0].questions, function(stat){
                           if(stat.statusColor) return stat.statusColor;
                           else return 'unanswered';
                        });
                        var response = {
                           gameid: result[0]._id,
                           quesNum: result[0].questions.length,
                           title: result[0].name,
                           time: {
                              hours: timeLeft[2],
                              minutes: timeLeft[1],
                              seconds: timeLeft[0]
                           },
                           questionsStatuses: statsArr
                        };
                        res.render('gameScreen/gamescreen', response);
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
                     if(!isGameActive(result[0])){
                        res.send(errors.GAME_ENDED);
                        db.close();
                        return;
                     }
                     var isCorrect = (answer===result[0].questions[queID].answer);
                     res.send(isCorrect);
                     io.sockets.in(gameID).emit((isCorrect)?'correct':'wrong', queID+1);
                     var questionsToSave = result[0].questions;
                     questionsToSave[queID].isAnswered = isCorrect;
                     questionsToSave[queID].statusColor = (isCorrect)?'correct':'wrong';
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
                        }else if(result.result.n===0){
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
         var gameID = parseInt(req.params.gameId), queID = parseInt(req.params.queId)-1;
         io.sockets.in(gameID).emit('unanswered', queID+1);
         mongo.connect(mongodb.urlToDB, function(err, db){
            if(err){
               res.send(errors.DB_CONNECT_ERROR);
               return;
            }
            else{
               var gamesDB = db.collection('games');
               var gamesFound = gamesDB.find({_id: gameID});
               gamesFound.toArray(function(err, result){
                  if(err){
                     res.send(errors.UNKNOWN);
                  }else{
                     result[0].questions[queID].statusColor = 'unanswered';
                     gamesDB.updateOne({_id: gameID}, {$set:{
                        questions: result[0].questions
                     }}, function(err, result){
                        if(err){
                           console.log(errors.UNKNOWN);
                           console.log(err);
                        }else if(result.result.n===0){
                           console.log(errors.DB_OPERATION);
                           console.log(result.result);
                        }
                        db.close();
                     }
                  )
               }
            });
         }
      });
   });

   router.get('/select/:gameId/:queId', function(req, res){
      var gameID = parseInt(req.params.gameId), queID = parseInt(req.params.queId)-1;
      io.sockets.in(gameID).emit('selected', queID+1);
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var gamesDB = db.collection('games');
            var gamesFound = gamesDB.find({_id: gameID});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  result[0].questions[queID].statusColor = 'selected';
                  gamesDB.updateOne({_id: gameID}, {$set:{
                     questions: result[0].questions
                  }}, function(err, result){
                     if(err){
                        console.log(errors.UNKNOWN);
                        console.log(err);
                     }else if(result.result.n===0){
                        console.log(errors.DB_OPERATION);
                        console.log(result.result);
                     }
                     db.close();
                  }
               )
            }
         });
      }
   });
});

return router;
};

/* ========== Private Methods ========== */

function isGameActive(game){
   return (game.ending - new Date() > 0 || game.isEnded===false);
}

Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000) + (10*1000));
   return this;
};

Date.prototype.addMinutes = function(m) {
   this.setTime(this.getTime() + (m*60*1000) + (10*1000));
   return this;
};
