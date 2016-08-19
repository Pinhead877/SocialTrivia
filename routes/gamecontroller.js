var MAX_POSSIBLE_LETTERS = 12;

// BASE /gamecontroller
module.exports = function(mongodb, errors) {
   var express = require('express');
   var router = express.Router();
   var mongo = mongodb.MongoClient;
   var _ = require('lodash');

   router.get('/', function(req, res, next) {
      res.render('gameremote/gameenter', {});
   });

   router.get('/quepick/:gameId', function(req, res, next) {
      res.render('gameremote/qpick', {gameid: req.params.gameId});
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
               db.close();
            });
         }
      });
   });

   router.get('/quescreen/:gameId/:queId', function(req, res){
      var gameid = parseInt(req.params.gameId);
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var gamesDB = db.collection("games");
            var gamesFound = gamesDB.find({_id: gameid });
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else if(!isGameActive(result[0])){
                  res.render("gameremote/gameresults", {gameid: gameid });
               }else{
                  var lettersInEachWord = [];
                  _.forEach(result[0].questions[req.params.queId-1].answer.split(" "), function(word){
                     lettersInEachWord.push(word.length);
                  });
                  var possibleLettersString = result[0].questions[req.params.queId-1].answer.split(" ").join("");
                  possibleLettersString += createRandomLetters(MAX_POSSIBLE_LETTERS - possibleLettersString.length);
                  possibleLettersString = possibleLettersString.shuffle().toUpperCase();
                  var possibleLetters = [];
                  possibleLetters.push(possibleLettersString.substring(0,MAX_POSSIBLE_LETTERS/2).split(""));
                  possibleLetters.push(possibleLettersString.substring(MAX_POSSIBLE_LETTERS/2).split(""));
                  var params = {
                     gameId: gameid,
                     queId: req.params.queId,
                     count: lettersInEachWord,
                     que: result[0].questions[req.params.queId-1].question,
                     possibleLetters: possibleLetters
                  };
                  res.render('gameremote/quescreen',{params: params});
               }
               db.close();
            });
         }
      });
   });

   return router;
}

/* ========== Private Methods ========== */

function isGameActive(game){
   return (game.ending - new Date() > 0 || game.isEnded===false);
}

function createRandomLetters(len){
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
