module.exports = function(db, errors) {
   var express = require('express');
   var router = express.Router();
   var _ = require('lodash');
   var ObjectID = require('mongodb').ObjectID

   router.get('/', function(req, res){
      res.render('profile/profilescreen');
   });

   router.get('/editProfile/', function(req, res){
      res.render('profile/editprofile');
   });

   router.get('/games/', function(req, res){
      res.render('profile/usergames');
   });

   router.get('/questions/', function(req, res){
      res.render('profile/userquestions');
   });

   router.get('/getGames',function(req, res){
      var userID = req.session.userid;
      var gamesDB = db.collection('games');
      var gamesFound = gamesDB.find({'creator.userid': userID});
      gamesFound.toArray(function(err, result){
         if(err){
            res.send(errors.UNKNOWN);
         }else{
            _.sortBy(result, ['isStarted']);
            res.send(result.reverse());
         }
      });
   });

   router.get('/getPlayerDetails', function(req, res){
      var userID = req.session.userid;
      var playerDB = db.collection('users');
      var gamesDB = db.collection('games');
      var gamesFound = gamesDB.find({"creator.userid": userID});
      var questionsDB = db.collection('questions');
      var questionsFound = questionsDB.find({userid: userID});
      var playersFound = playerDB.find({_id: new ObjectID(userID)});
      playersFound.toArray(function(err, result){
         if(err || result[0]==null){
            res.send(errors.UNKNOWN);
         }
         else{
            delete result[0].password;
            gamesFound.toArray(function(err, gamesResult){
               if(err){
                  res.send(errors.UNKNOWN);
               }
               else{
                  questionsFound.toArray(function(err, questionsResult){
                     if(err){
                        res.send(errors.UNKNOWN);
                     }
                     else{
                        var ageInMilli = new Date()-new Date(result[0].birthday);
                        result[0].age = getYearsFromMilli(ageInMilli);
                        result[0].gamesCreated = gamesResult.length;
                        result[0].questionsCreated = questionsResult.length;
                        res.send(result[0]);
                     }
                  });
               }
            });
         }
      });
   });

   return router;
}

/** ** ** ** ** Private Methods ** ** ** ** **/

function getYearsFromMilli(time){
   time=Math.floor(time/1000);
   return Math.floor(time/31536000);
}
