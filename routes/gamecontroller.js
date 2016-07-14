// BASE /gamecontroller

module.exports = function(mongodb, errors) {
   var express = require('express');
   var router = express.Router();
   var mongo = mongodb.MongoClient;

   router.get('/', function(req, res, next) {
      res.render('gameremote/gameenter', {});
   });

   // TODO - delete this!!! Changes
   router.get('/', function(req, res, next) {
      res.render('gameremote/qpick', {});
   });


   router.get('/quescreen/:gameId/:queId', function(req, res){
      //TODO get the question from the DB or the server

      var params = {
         gameId: req.params.gameId,
         queId: req.params.queId,
         count: 5,
         que: "What is called a cat?"
      };

      res.render('gameremote/quescreen',{params: params});
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
                  games[0].players.push({_id: req.session.userid, nickname: req.session.nickname});
                  gamesDB.updateOne(
                     { _id: games[0]._id },
                     { $set: { players: games[0].players } }
                  );
                  res.sendStatus(200);
               }
               db.close();
            });
         }
      });

   });
   return router;
}
