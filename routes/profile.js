module.exports = function(db, errors) {
   var express = require('express');
   var router = express.Router();
   // var mongo = mongodb.MongoClient;
   var _ = require('lodash');
   var ObjectID = require('mongodb').ObjectID

   router.get('/', function(req, res){
      res.render('profile/profilescreen');
   });

   router.get('/games/', function(req, res){
      res.render('profile/usergames');
   });

   router.get('/questions/', function(req, res){
      res.render('profile/userquestions');
   });

   router.get('/getGames',function(req, res){
      var userID = req.session.userid;
      // mongo.connect(mongodb.urlToDB, function(err, db){
      //    if(err){
      //       res.send(errors.DB_CONNECT_ERROR);
      //       return;
      //    }
      //    else{
            var gamesDB = db.collection('games');
            var gamesFound = gamesDB.find({'creator.userid': userID});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  _.sortBy(result, ['isStarted']);
                  res.send(result.reverse());
               }
               // db.close();
            });
      //    }
      // });
   });

   return router;
}
