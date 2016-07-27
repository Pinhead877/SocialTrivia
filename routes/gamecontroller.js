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
               }else if(!isGameActive(games[0])){
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
   return router;
}

/* ========== Private Methods ========== */

function isGameActive(game){
   return (game.ending - new Date() > 0 || game.isEnded===false);
}
