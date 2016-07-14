// BASE /gamescreen

module.exports = function(mongodb, errors){
   var express = require('express');
   var router = express.Router();
   var mongo = mongodb.MongoClient;

   router.get('/create',function(req, res){
      res.render('gameScreen/create');
   });

   router.get('/gamestart',function(req, res){
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
