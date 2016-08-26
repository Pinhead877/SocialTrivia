var MAX_POSSIBLE_LETTERS = 12;

// BASE /gamecontroller
module.exports = function(db, errors) {
   var express = require('express');
   var router = express.Router();
   // var mongo = mongodb.MongoClient;
   var _ = require('lodash');

   router.get('/', function(req, res, next) {
      res.render('gameremote/gameenter', {});
   });

   router.get('/quepick/:gameId', function(req, res, next) {
      var gameID = parseInt(req.params.gameId), playerID = req.session.userid;
      // mongo.connect(mongodb.urlToDB, function(err, db){
      //    if(err){
      //       res.send(errors.DB_CONNECT_ERROR);
      //       return;
      //    }
      //    else{
            var gamesDB = db.collection("games");
            var gamesFound = gamesDB.find({_id: gameID});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  var player = _.find(result[0].players,{_id: playerID });
                  if(player != null){
                     res.render('gameremote/qpick', { gameid: gameID, points: player.points });
                  }
                  else if(result[0].isEnded){
                     res.render("gameremote/gameresults", {gameid: gameID });
                  }
                  else{
                     res.render('error', {message: "You can't enter a game you dont exists in!", error: {}});
                  }
               }
               // db.close();
            });
      //    }
      // });
   });

   router.get('/:gameId/:queId',function(req, res){
      var gameID = parseInt(req.params.gameId), queID = parseInt(req.params.queId)-1;
      // mongo.connect(mongodb.urlToDB, function(err, db){
      //    if(err){
      //       res.send(errors.DB_CONNECT_ERROR);
      //       return;
      //    }
      //    else{
            var gamesDB = db.collection("games");
            var gamesFound = gamesDB.find({_id: gameID});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  var question = result[0].questions[queID];
                  if(question==null){
                     res.send(errors.QUE_NOT_EXISTS);
                  }else if(!isGameActive(result[0])){
                     res.send(errors.GAME_ENDED);
                  }else if(question.statusColor === 'selected'){
                     res.send(errors.QUE_OCCIPIED);
                  }else if(question.isAnswered){
                     res.send(errors.QUE_ANSWERED);
                  }else if(question.playersTried != null && _.findIndex(question.playersTried, {_id: req.session.userid}) != -1){
                     res.send(errors.QUE_TRIED);
                  }else{
                     res.sendStatus(200);
                  }
               }
               // db.close();
            });
      //    }
      // });
   });

   router.get('/quescreen/:gameId/:queId', function(req, res){
      var gameid = parseInt(req.params.gameId), queid = req.params.queId-1,
      playerID = req.session.userid;
      // mongo.connect(mongodb.urlToDB, function(err, db){
      //    if(err){
      //       res.send(errors.DB_CONNECT_ERROR);
      //       return;
      //    }
      //    else{
            var gamesDB = db.collection("games");
            var gamesFound = gamesDB.find({_id: gameid });
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else if(!isGameActive(result[0])){
                  res.render("gameremote/gameresults", {gameid: gameid });
               }else if(result[0].questions[queid].playersTried != null && _.findIndex(result[0].questions[queid].playersTried, {_id: playerID }) != -1){
                  res.redirect("/gamecontroller/quepick/"+gameid);
               }else if(result[0].questions[queid].statusColor === 'selected'){
                  res.redirect("/gamecontroller/quepick/"+gameid);
               }
               else{
                  var lettersInEachWord = [];
                  _.forEach(result[0].questions[queid].answer.split(" "), function(word){
                     lettersInEachWord.push(word.length);
                  });
                  var possibleLettersString = result[0].questions[queid].answer.split(" ").join("");
                  possibleLettersString += createRandomLettersEN(MAX_POSSIBLE_LETTERS - possibleLettersString.length);
                  possibleLettersString = possibleLettersString.shuffle().toUpperCase();
                  var possibleLetters = [];
                  possibleLetters.push(possibleLettersString.substring(0,MAX_POSSIBLE_LETTERS/2).split(""));
                  possibleLetters.push(possibleLettersString.substring(MAX_POSSIBLE_LETTERS/2).split(""));
                  var points = (result[0].questions[queid].playersTried == null) ? 5 : (result[0].questions[queid].playersTried.length * 5) + 5;
                  var players = (result[0].questions[queid].playersTried==null)?[]:result[0].questions[queid].playersTried;
                  var player = {};
                  player._id = playerID;
                  player.enteredOn = new Date();
                  player.questionValidUntil = new Date().addMinutes(1);
                  var questionsToSave = result[0].questions;
                  if(questionsToSave[queid].playersTried==null){
                     questionsToSave[queid].playersTried = [];
                  }
                  questionsToSave[queid].playersTried.push(player);
                  questionsToSave[queid].statusColor = "selected";
                  var params = {
                     gameId: gameid,
                     queId: req.params.queId,
                     count: lettersInEachWord,
                     que: result[0].questions[queid].question,
                     possibleLetters: possibleLetters,
                     quePoints: points,
                     timeleft: parseInt((player.questionValidUntil - player.enteredOn)/1000)
                  };
                  res.render('gameremote/quescreen',{params: params});

                  gamesDB.updateOne({_id: gameid}, {$set: {questions: questionsToSave}}, function(err, result){
                     if(err){
                        console.log(errors.UNKNOWN);
                        console.log(err);
                     }else if(result.result.n===0){
                        console.log(errors.DB_OPERATION);
                        console.log(result.result);
                     }
                     // db.close();
                  });
               }
            });
      //    }
      // });
   });

   return router;
}

/* ========== Private Methods ========== */

function isGameActive(game){
   return (game.ending - new Date() > 0 || game.isEnded===false);
}

function createRandomLettersEN(len){
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
   for( var i=0; i < len; i++ )
   text += possible.charAt(Math.floor(Math.random() * possible.length));
   return text;
}

function createRandomLettersHE(len){
   var text = "";
   var possible = "אבגדהוזחטיכלמנסעפצקרשת0123456789";
   for( var i=0; i < len; i++ )
   text += possible.charAt(Math.floor(Math.random() * possible.length));
   return text;
}

String.prototype.shuffle = function () {
   var a = this.split(""),
   n = a.length;

   for(var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
   }
   return a.join("");
}

Date.prototype.addMinutes = function(m) {
   this.setTime(this.getTime() + (m*60*1000) + (10*1000));
   return this;
};
