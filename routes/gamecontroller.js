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
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var gamesDB = db.collection("games");
            var gamesFound = gamesDB.find({_id:parseInt(req.params.gameId)});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else if(!isGameActive(result[0])){
                  res.send(errors.GAME_ENDED);
               }else{
                  var params = {
                     gameId: req.params.gameId,
                     queId: req.params.queId,
                     count: result[0].questions[req.params.queId-1].answer.length,
                     que: result[0].questions[req.params.queId-1].question
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
