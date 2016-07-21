// BASE /gamecontroller

module.exports = function(mongodb, errors) {
   var express = require('express');
   var router = express.Router();
   var mongo = mongodb.MongoClient;

   router.get('/', function(req, res, next) {
      res.render('gameremote/gameenter', {});
   });

   router.get('/quepick/:gameId', function(req, res, next) {
      res.render('gameremote/qpick', {gameid: req.params.gameId});
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
      if(req.body.gamenum==null){
         res.sendStatus(400);
         return;
      }
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }else{
            var gamesDB = db.collection('games');
            var findResult = gamesDB.find({ _id: req.body.gamenum });
            findResult.toArray(function(err, games){
               if(err){
                  console.log(err);
                  res.send(errors.UNKNOWN)
               }
               if(games.length===0){
                  res.send(errors.GAME_NUM_ERROR);
               }else{
                  if(games[0].players == null){
                     games[0].players = [];
                  }
                  if(req.session.userid == games[0].creator.userid){
                     res.send(errors.CREATOR_IS_PLAYER);
                     return;
                  }
                  games[0].players.push({
                     _id: req.session.userid,
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
                  res.sendStatus(200);
               }
            });
         }
      });

   });
   return router;
}
