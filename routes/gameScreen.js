// BASE /gamescreen
"use strict";
var CORRECT_ANSWER_POINTS = 5;

module.exports = function(io, db, errors){
   var express = require('express');
   var router = express.Router();
   var _ = require('lodash');

   io.on('connection', function(socket){
      socket.on('room', function(gameId){
         socket.join(gameId);
      });
   });

   router.get('/results/:gameid',function(req, res){
      res.render('gameScreen/results', {gameid: parseInt(req.params.gameid)});
   });

   router.get('/create',function(req, res){
      res.render('gameScreen/create', {});
   });

   router.get('/gamestartscreen/:gameId',function(req, res){
      var gameID = parseInt(req.params.gameId);
      res.render('gameScreen/gameStart', { game: gameID });
   });

   router.get('/userexitgame/:gameId', function(req, res){
      var gameID = parseInt(req.params.gameId);
      var gamesDB = db.collection('games');
      var gamesFound = gamesDB.find({ _id: gameID });
      gamesFound.toArray(function(err, games){
         if(err){
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
               });
            }
         });
      });

      //TODO - send the userid and name of the requested ids
      router.get('/loggedToGameList/:gameid', function(req, res){
         var gameid = parseInt(req.params.gameid);
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
         });
      });

      router.get('/startgame/:gameId', function(req, res){
         var gameID = parseInt(req.params.gameId);
         var gamesDB = db.collection('games');
         var gamesFound = gamesDB.find({ _id: gameID});
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
                  return;
               }else{
                  if(gameSelected[0].players == null || gameSelected[0].players.length < 2){
                     res.send(errors.NO_PLAYERS);
                     return;
                  }else{
                     gamesDB.updateOne({
                        _id: gameID
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
                           io.sockets.in(gameID).emit('startgame');
                        }
                     });
                  }
               }
            }
         });
      });

      router.post('/entergame', function(req,res){
         var gameID = parseInt(req.body.gamenum), playerID = req.session.userid;
         if(gameID==null){
            res.sendStatus(400);
            return;
         }
         var gamesDB = db.collection('games');
         var findResult = gamesDB.find({ _id: gameID });
         findResult.toArray(function(err, games){
            if(err){
               console.log(err);
               res.send(errors.UNKNOWN);
            }
            else if(games.length===0){
               res.send(errors.GAME_NUM_ERROR);
            }
            else if(games[0].isStarted===true && isGameActive(games[0])){
               if(_.find(games[0].players,{_id: playerID })){
                  res.send(errors.GAME_STARTED_WITH_PLAYER);
               }else{
                  res.send(errors.GAME_STARTED_NO_PLAYER);
               }
            }
            else if(games[0].isStarted===true && !isGameActive(games[0])){
               res.send(errors.GAME_ENDED);
            }
            else{
               games[0].players = (games[0].players == null) ? [] : games[0].players;
               if(playerID === parseInt(games[0].creator.userid)){
                  res.send(errors.CREATOR_IS_PLAYER);
               }
               else if(_.find(games[0].players,{_id: playerID })){
                  res.send(errors.USER_EXISTS_IN_GAME);
               }
               else{
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
                     }
                  );
               }
            }
         });
      });

      router.get('/:gameId', function(req, res) {
         var gameId = parseInt(req.params.gameId);
         var userID = req.session.userid;
         // find the game request in the DB
         var gamesDB = db.collection("games");
         var gamesFound = gamesDB.find({ _id: gameId });
         // Materialies the results to an array
         gamesFound.toArray(function(err, result){
            if(err){ // If some mongo interanl error
               res.render('error', {message: errors.UNKNOWN.message});
               console.log(err);
            }else{
               if(result[0]==null){ // No games found error
                  res.render('error', {message: errors.GAME_NUM_ERROR.message});
               }
               else if(result[0].isStarted==null){ // The game not started yet
                  res.render('gameScreen/startgame/'+gameId);
               }
               else if(result[0].isEnded===true){ // The game has Ended Properly redirect to results
                  res.render('gameScreen/results', errors.GAME_ENDED);
               }
               else if(result[0].creator.userid!=userID){
                  res.render('error', {message: "Well well well... I see what you did there"});
               }
               else if(new Date() - result[0].ending > 0){ // The game has Ended But not set as Ended
                  res.render('gameScreen/results', errors.GAME_ENDED);
                  gamesDB.updateOne({ _id: gameId},
                     {$set: {isEnded: true}},
                     function(err, result){
                        if(err)
                        {
                           console.log("else if(new Date() - result[0].ending > 0){");
                           console.log(err);
                        }
                        else if(result.result.n===0)
                        {
                           console.log("else if(new Date() - result[0].ending > 0){");
                           console.log(result.result);
                        }
                     });
                  }
                  else if(result[0]){ // The game is running right now
                     //update the time left for the game to end
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
                     // Update the questions statuses
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
            });
         });

         router.post('/answers',function(req, res){
            var gameID = parseInt(req.body.gameid), queID = parseInt(req.body.queid)-1,
            answer = req.body.answers, isCorrect, userID = req.session.userid;
            var gamesDB = db.collection("games");
            var gamesFound = gamesDB.find({_id:parseInt(gameID)});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
                  return;
               }else{
                  if(!isGameActive(result[0])){
                     res.send(errors.GAME_ENDED);
                     return;
                  }
                  isCorrect = (answer===result[0].questions[queID].answer.toUpperCase());
                  io.sockets.in(gameID).emit((isCorrect)?'correct':'wrong', queID+1);
                  var questionsToSave = result[0].questions;
                  questionsToSave[queID].isAnswered = isCorrect;
                  questionsToSave[queID].statusColor = (isCorrect)?'correct':'wrong';
                  questionsToSave[queID].answeredBy = (isCorrect)?userID:null;
                  var playersToSave = result[0].players;
                  let playerIndex = _.findIndex(playersToSave, {_id: userID});
                  let pointsMulti = CORRECT_ANSWER_POINTS*result[0].questions[queID].playersTried.length;
                  playersToSave[playerIndex].points += (isCorrect)?pointsMulti:0;
                  if(isCorrect===false && playersToSave.length===result[0].questions[queID].playersTried.length){
                     io.sockets.in(gameID).emit('blocked', queID+1);
                     questionsToSave[queID].statusColor = 'blocked'
                  }
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
                     io.sockets.in(gameID).emit('pointsUpdated');
                     res.send(isCorrect);
                  });
               }
            });
         });

         router.get('/back/:gameId/:queId', function(req, res){
            var gameID = parseInt(req.params.gameId), queID = parseInt(req.params.queId)-1;
            io.sockets.in(gameID).emit('unanswered', queID+1);
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
                  });
               }
            });
         });

         router.get('/select/:gameId/:queId', function(req, res){
            var gameID = parseInt(req.params.gameId), queID = parseInt(req.params.queId)-1;
            io.sockets.in(gameID).emit('selected', queID+1);
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
                  }
               )
            }
         });
      });

      return router;
   };

   /* ========== Private Methods ========== */

   function isGameActive(game){
      return (game.ending - new Date() > 0 && game.isEnded===false);
   }

   Date.prototype.addHours = function(h) {
      this.setTime(this.getTime() + (h*60*60*1000) + (10*1000));
      return this;
   };

   Date.prototype.addMinutes = function(m) {
      this.setTime(this.getTime() + (m*60*1000) + (10*1000));
      return this;
   };
